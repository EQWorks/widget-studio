import React, { useMemo } from 'react'

import { TextField, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import ColorSchemeControls from './components/color-scheme-controls'
import SliderControl  from './components/slider-control'
import { renderItem, renderSection, renderRow } from '../shared/util'
import typeInfo from '../../constants/type-info'


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

const textFieldlInput = 'text-interactive-600'

const MapLayerDisplay = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const type = useStoreState((state) => state.type)

  const [rangeRadius, simpleRadius, elevation] = useMemo(() => ([
    renderableValueKeys.find(vis => (vis.mapVis === 'radius' && vis.key)),
    JSON.stringify(mapValueKeys).includes('radius') &&
      !renderableValueKeys.find(vis => (vis.mapVis === 'radius' && vis.key)),
    JSON.stringify(renderableValueKeys).includes('elevation'),
  ]), [renderableValueKeys, mapValueKeys])

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
                <TextField
                  type='number'
                  deleteButton={false}
                  placeholder={'Value'}
                  value={uniqueOptions.opacity?.toString() ?? typeInfo[type].uniqueOptions.opacity.toString()}
                  min={0}
                  max={100}
                  step={1}
                  onChange={v => userUpdate({ uniqueOptions: { opacity: Number(v) } })}
                  onSubmit={(e) => e.nativeEvent.preventDefault()}
                  classes={{ container: classes.textFieldContainer, input: textFieldlInput }}
                />
              )}
            </div>
          )}
          {renderRow(null,
            <div className={classes.sliderOutline}>
              {simpleRadius &&
                renderItem('Radius Size (px)',
                  <SliderControl
                    style='map'
                    option='radius'
                    update={val => userUpdate({
                      uniqueOptions: {
                        radius: {
                          value: val,
                        },
                      },
                    })}
                    range={false}
                  />
                )
              }
              {rangeRadius &&
                renderItem('Radius Size (px)',
                  <SliderControl
                    style='map'
                    option='radius'
                    update={val => userUpdate({
                      uniqueOptions: {
                        radius: {
                          valueOptions: val,
                        },
                      },
                    })}
                    range={true}
                  />
                )
              }
              {elevation &&
                renderItem('Elevation Height (m)',
                  <SliderControl
                    style='map'
                    option='elevation'
                    update={val => userUpdate({
                      uniqueOptions: {
                        elevation: {
                          value: Number(val),
                        },
                      },
                    })}
                    range={false}
                  />
                )
              }
              {!elevation &&
                renderItem('Outline Width (px)',
                  <TextField
                    type='number'
                    deleteButton={false}
                    placeholder={'Value'}
                    value={uniqueOptions.lineWidth?.value?.toString() ??
                      typeInfo[type].uniqueOptions.lineWidth.toString()}
                    min={1}
                    max={100}
                    step={1}
                    onChange={v => userUpdate({ uniqueOptions: { lineWidth: { value: Number(v) } } })}
                    onSubmit={(e) => e.nativeEvent.preventDefault()}
                    classes={{ container: classes.textFieldContainer, input: textFieldlInput }}
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
