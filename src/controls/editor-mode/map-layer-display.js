import React, { useMemo } from 'react'

import { TextField, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import ColorSchemeControls from './components/color-scheme-controls'
import SliderControl  from './components/slider-control'
import { renderItem, renderSection, renderRow } from '../shared/util'


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

const textFiedlInput = 'text-interactive-600'

const MapLayerDisplay = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)

  const activeVisualizations = useMemo(() =>
    renderableValueKeys.map(vis => vis.mapVis), [renderableValueKeys])

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
                  placeholder={'0'}
                  value={uniqueOptions.opacity.toString() ?? '100'}
                  min={0}
                  max={100}
                  step={1}
                  onChange={v => userUpdate({ uniqueOptions: { opacity: Number(v) } })}
                  classes={{ container: classes.textFieldContainer, input: textFiedlInput }}
                />
              )}
            </div>
          )}
          {renderRow(null,
            <div className={classes.sliderOutline}>
              {activeVisualizations?.includes('radius') &&
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
              {renderItem('Outline Width (px)',
                <TextField
                  type='number'
                  deleteButton={false}
                  placeholder={uniqueOptions.lineWidth.value.toString()}
                  value={uniqueOptions.lineWidth.value.toString() ?? '1'}
                  min={1}
                  max={100}
                  step={1}
                  onChange={v => userUpdate({ uniqueOptions: { lineWidth: { value: Number(v) } } })}
                  classes={{ container: classes.textFieldContainer, input: textFiedlInput }}
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
