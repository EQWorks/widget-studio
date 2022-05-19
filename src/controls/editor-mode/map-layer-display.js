import React, { useMemo, useCallback } from 'react'

import { TextField, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import ColorSchemeControls from './components/color-scheme-controls'
import SliderControl from './components/slider-control'
import { renderItem, renderSection, renderRow } from '../shared/util'
import typeInfo from '../../constants/type-info'
import { MAP_LAYERS, MAP_VALUE_VIS } from '../../constants/map'


const classes = makeStyles({
  // TO DO - readjust when we revise all styling
  opacityRow: {
    marginTop: '-0.625rem',
  },
  sliderOutline: {
    width: '100%',
    display: 'flex',
  },
  textFieldContainer: {
    width: '6.918rem',
  },
})

const LAYER_OPTIONS = Object.keys(typeInfo.map.uniqueOptions).reduce((acc, curr) => {
  acc[curr] = curr
  return acc
}, {})

const textFieldInput = 'text-interactive-600'

const MapLayerDisplay = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const mapLayer = useStoreState((state) => state.mapLayer)
  const type = useStoreState((state) => state.type)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)

  const [simpleRadius, rangeRadius, elevation, simpleArcWidth, rangeArcWidth] = useMemo(() => {
    return [
      mapLayer === MAP_LAYERS.scatterplot ||
        (dataIsXWIReport && !mapValueKeys.length) ||
        (dataIsXWIReport &&
          [MAP_VALUE_VIS.radius, MAP_VALUE_VIS.targetRadius]
            .some(vis => !JSON.stringify(renderableValueKeys).includes(vis))) ||
        Boolean(mapValueKeys.find(vis =>
          ((vis.mapVis === MAP_VALUE_VIS.radius || vis.mapVis === MAP_VALUE_VIS.targetRadius) &&
          !vis.key))
        ),
      Boolean(renderableValueKeys.find(vis =>
        ((vis.mapVis === MAP_VALUE_VIS.radius || vis.mapVis === MAP_VALUE_VIS.targetRadius) && vis.key))),
      JSON.stringify(renderableValueKeys).includes(MAP_VALUE_VIS.elevation),
      dataIsXWIReport && !JSON.stringify(renderableValueKeys).includes(MAP_VALUE_VIS.arcWidth),
      Boolean(renderableValueKeys.find(vis =>
        (vis.mapVis === MAP_VALUE_VIS.arcWidth && vis.key))),
    ]
  }, [mapLayer, mapValueKeys, dataIsXWIReport, renderableValueKeys])

  const getUniqueOptionsProps = useCallback(({ option, range, textField }) => {
    const {
      defaultValue: {
        value: defaultValue,
        valueOptions: defaultValueOptions,
      },
      step,
      min,
      max,
    } = typeInfo[type].uniqueOptions[option]
    let { value, valueOptions } = uniqueOptions[option] || {}

    // prevents TextField value updating to values or characters outside the [min, max] range
    if (!value) {
      if (value <= min || !Number(value)) {
        value = min
      } else {
        value = defaultValue
      }
    }

    return {
      ...(textField ? '' : { style: 'map', range }),
      step,
      min,
      max,
      value: range
        ? valueOptions || defaultValueOptions
        : value,
    }
  }, [type, uniqueOptions])

  const getTextFieldVal = useCallback(({ option, value }) => {
    const { min, max } = typeInfo[type].uniqueOptions[option]
    if (value <= min || !Number(value)) {
      return min
    }
    return value >= max ? max : value
  }, [type])

  const renderRadiusControl = ({ range }) =>
    renderItem(range ? 'Radius Range (px)' : 'Radius Size (px)',
      <SliderControl
        {...getUniqueOptionsProps(
          {
            option: LAYER_OPTIONS.radius,
            range,
            textField: false,
          }
        )}
        update={val => userUpdate({
          uniqueOptions: {
            radius: {
              ...(range
                ? { valueOptions: [Number(val[0]), Number(val[1])] }
                : { value: Number(val) }),
            },
          },
        })}
      />
    )

  const arcWidthControl = renderItem('Arc Width (px)',
    <SliderControl
      {...getUniqueOptionsProps(
        {
          option: LAYER_OPTIONS.arcWidth,
          range: rangeArcWidth,
          textField: false,
        }
      )}
      update={val => userUpdate({
        uniqueOptions: {
          arcWidth: {
            ...(rangeArcWidth
              ? { valueOptions: [Number(val[0]), Number(val[1])] }
              : { value: Number(val) }),
          },
        },
      })}
    />
  )

  return (
    <div className={classes.displayOptions}>
      {renderSection('Layer Display',
        <>
          {renderItem('Color Scheme',
            <ColorSchemeControls />
          )}
          {renderRow(null,
            <div className={classes.opacityRow}>
              {renderItem('Opacity (%)',
                <SliderControl
                  {...getUniqueOptionsProps(
                    {
                      option: LAYER_OPTIONS.opacity,
                      range: false,
                      textField: false,
                    }
                  )}
                  update={val => userUpdate({
                    uniqueOptions: {
                      opacity: {
                        value: Number(val),
                      },
                    },
                  })}
                />
              )}
            </div>
          )}
          {renderRow(null,
            <div className={classes.sliderOutline}>
              {(simpleRadius || rangeRadius) &&
                !dataIsXWIReport &&
                renderRadiusControl({ range : rangeRadius })
              }
              {(simpleArcWidth || rangeArcWidth) &&
                dataIsXWIReport &&
                arcWidthControl
              }
              {elevation &&
                renderItem('Elevation Height (m)',
                  <SliderControl
                    {...getUniqueOptionsProps(
                      {
                        option: LAYER_OPTIONS.elevation,
                        range: false,
                        textField: false,
                      }
                    )}
                    update={val => userUpdate({
                      uniqueOptions: {
                        elevation: {
                          value: Number(val),
                        },
                      },
                    })}
                  />
                )
              }
              {!elevation &&
                renderItem('Outline Width (px)',
                  <TextField
                    type='number'
                    deleteButton={false}
                    placeholder={'Value'}
                    // TO DO - ask design if we should still use this when reviewing WS, as the Slider
                    // cannot accomodate yet a sufix and it won't match with the simple TextField buttons
                    // for the rest of the unique controls for map
                    // inputProps={{ suffix: 'px' }}
                    {...getUniqueOptionsProps(
                      {
                        option: LAYER_OPTIONS.lineWidth,
                        range: false,
                        textField: true,
                      }
                    )}
                    onChange={value => {
                      userUpdate({
                        uniqueOptions: {
                          lineWidth: {
                            value: Number(getTextFieldVal({ option: LAYER_OPTIONS.lineWidth, value })),
                          },
                        },
                      })
                    }}
                    classes={{ container: classes.textFieldContainer, input: textFieldInput }}
                  />
                )}
            </div>
          )}
          {renderRow(null,
            <div className={classes.sliderOutline}>
              {simpleRadius &&
                dataIsXWIReport &&
                renderRadiusControl({ range: false })
              }
              {rangeRadius &&
                dataIsXWIReport &&
                renderRadiusControl({ range: rangeRadius })
              }
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MapLayerDisplay
