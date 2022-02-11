import React from 'react'

import { TextField, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import ColorSchemeControls from './components/color-scheme-controls'
// import CustomSelect from '../../components/custom-select'
import { renderItem, renderSection, renderRow } from '../shared/util'


const classes = makeStyles({
  displayOptions: {
    marginTop: '0.625rem',
  },
  textFields: {
    width: '100%',
    display: 'flex',
  },
  textFieldContainer: {
    width: '6.918rem',
  },
})

const textFiedlInput = 'text-interactive-600'
// const textFieldRoot = 'shadow-light-10 rounded-md'

const MapLayerDisplay = () => {
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const nestedUpdate = useStoreActions((actions) => actions.nestedUpdate)

  return (
    <div className={classes.displayOptions}>
      {renderSection('Layer Display',
        <>
          {renderItem('Color Scheme',
            <ColorSchemeControls />
          )}
          {/* {renderRow(null,
            <div className={classes.textFields}>
              {renderItem('Opacity',
                <TextField
                  type='number'
                  deleteButton={false}
                  placeholder={0}
                  value={uniqueOptions.opacity ?? 1}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={v => nestedUpdate({ uniqueOptions: { opacity: Number(v) } })}
                  classes={{ container: classes.textFieldContainer, input: textFiedlInput }}
                />
              )}
              {renderItem('Outline Width',
                <TextField
                  type='number'
                  deleteButton={false}
                  placeholder={uniqueOptions.lineWidth}
                  value={uniqueOptions.lineWidth ?? 1}
                  inputProps={{ suffix: 'px' }}
                  min={1}
                  max={100}
                  step={1}
                  onChange={v => nestedUpdate({ uniqueOptions: { lineWidth: Number(v) } })}
                  classes={{ container: classes.textFieldContainer, input: textFiedlInput }}
                />
              )}
            </div>
          )} */}
          {renderRow(null,
            <>
              {renderItem('Opacity (%)',
                <TextField
                  type='number'
                  deleteButton={false}
                  placeholder={0}
                  value={uniqueOptions.opacity ?? 100}
                  // inputProps={{ suffix: '%' }}
                  min={0}
                  max={100}
                  step={1}
                  onChange={v => nestedUpdate({ uniqueOptions: { opacity: Number(v) } })}
                  classes={{ container: classes.textFieldContainer, input: textFiedlInput }}
                />
              )}
            </>
          )}
          {renderRow(null,
            <>
              {renderItem('Outline Width (px)',
                <TextField
                  type='number'
                  deleteButton={false}
                  placeholder={uniqueOptions.lineWidth}
                  value={uniqueOptions.lineWidth ?? 1}
                  // inputProps={{ suffix: 'px' }}
                  min={1}
                  max={100}
                  step={1}
                  onChange={v => nestedUpdate({ uniqueOptions: { lineWidth: Number(v) } })}
                  classes={{ container: classes.textFieldContainer, input: textFiedlInput }}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default MapLayerDisplay
