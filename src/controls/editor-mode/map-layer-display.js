import React, { useMemo, useCallback } from 'react'

import { TextField, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

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
  layerControl: {
    width: '100%',
    display: 'flex',
    gap: '0.625rem',
  },
  layerControlNoOpacity : {
    width: '100%',
    display: 'flex',
    marginTop: '-1.25rem',
    gap: '0.625rem',
  },
  layerName: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-700'),
  },
  textFieldContainer: {
    width: '9.5315rem',
  },
  radius: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '0.4rem',
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

  // checks to find what type of controls we need for Layer Display panel
  const [
    simpleRadius,
    rangeRadius,
    rangeRadiusSource,
    rangeRadiusTarget,
    elevation,
    simpleArcWidth,
    rangeArcWidth,
    colorFill,
  ] = useMemo(() => {
    return [
      mapLayer === MAP_LAYERS.scatterplot ||
        Boolean(!dataIsXWIReport && mapValueKeys.find(vis =>
          ((vis.mapVis === MAP_VALUE_VIS.radius || vis.mapVis === MAP_VALUE_VIS.targetRadius) &&
          !vis.key))
        ),
      Boolean(renderableValueKeys.find(vis =>
        ((vis.mapVis === MAP_VALUE_VIS.radius || vis.mapVis === MAP_VALUE_VIS.targetRadius) && vis.key))),
      Boolean(renderableValueKeys.find(vis => (vis.mapVis === MAP_VALUE_VIS.radius && vis.key))),
      Boolean(renderableValueKeys.find(vis => (vis.mapVis === MAP_VALUE_VIS.targetRadius && vis.key))),
      JSON.stringify(renderableValueKeys).includes(MAP_VALUE_VIS.elevation),
      dataIsXWIReport && !JSON.stringify(renderableValueKeys).includes(MAP_VALUE_VIS.arcWidth),
      Boolean(renderableValueKeys.find(vis =>
        (vis.mapVis === MAP_VALUE_VIS.arcWidth && vis.key))),
      Boolean(renderableValueKeys.find(vis =>
        ((vis.mapVis === MAP_VALUE_VIS.fill || vis.mapVis === MAP_VALUE_VIS.targetFill) && vis.key))),
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
    renderItem('Radius Size (px)',
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
              {(simpleRadius || rangeRadius || rangeRadiusSource ||
                rangeRadiusTarget || elevation || colorFill) &&
                renderItem('Opacity (%)',
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
            <div className={(simpleRadius || rangeRadius || rangeRadiusSource ||
                rangeRadiusTarget || elevation || colorFill) ?
              classes.layerControl :
              classes.layerControlNoOpacity}
            >
              {!dataIsXWIReport &&
                (simpleRadius || rangeRadius) &&
                renderRadiusControl({ range : rangeRadius })
              }
              {dataIsXWIReport &&
                (simpleArcWidth || rangeArcWidth) &&
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
            <div className={classes.layerControl}>
              {dataIsXWIReport &&
                rangeRadius &&
                (rangeRadiusSource || rangeRadiusTarget) &&
                <div className={classes.radius}>
                  {rangeRadiusSource !== rangeRadiusTarget && (
                    <div className={classes.layerName}>
                      {rangeRadiusSource ? 'Source Layer' : 'Target Layer'}
                    </div>
                  )}
                  {renderRadiusControl({ range: rangeRadius })}
                </div>
              }
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MapLayerDisplay
