import React, { useMemo, useCallback } from 'react'

import { TextField, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import ColorSchemeControls from './components/color-scheme-controls'
import SliderControl from './components/slider-control'
import { renderItem, renderSection, renderRow } from '../shared/util'
import typeInfo from '../../constants/type-info'
import { MAP_VALUE_VIS } from '../../constants/map'


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
  const type = useStoreState((state) => state.type)

  const [rangeRadius, simpleRadius, elevation] = useMemo(() => {
    const key = Boolean(renderableValueKeys.find(vis =>
      (vis.mapVis === MAP_VALUE_VIS.radius && vis.key)))
    return [
      key,
      JSON.stringify(mapValueKeys).includes(MAP_VALUE_VIS.radius) && !key,
      JSON.stringify(renderableValueKeys).includes(MAP_VALUE_VIS.elevation),
    ]
  }, [renderableValueKeys, mapValueKeys])

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
    if (value >= max) {
      return max
    }
    return value
  }, [type])

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
                renderItem('Radius Size (px)',
                  <SliderControl
                    {...getUniqueOptionsProps(
                      {
                        option: LAYER_OPTIONS.radius,
                        range: rangeRadius,
                        textField: false,
                      }
                    )}
                    update={val => userUpdate({
                      uniqueOptions: {
                        radius: {
                          ...(rangeRadius
                            ? { valueOptions: [Number(val[0]), Number(val[1])] }
                            : { value: Number(val) }),
                        },
                      },
                    })}
                  />
                )
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
                    // TO DO - ask Catherine if we should still use this, as the Slider cannot accomodate yet a sufix and it won't
                    // match with the simple TextField buttons for the rest of the unique controls for map
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
        </>
      )}
    </div>
  )
}

export default MapLayerDisplay
