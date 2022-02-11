import React from 'react'

import { makeStyles } from '@eqworks/lumen-labs'

// import { useStoreState, useStoreActions } from '../../store'
import ColorSchemeControls from './components/color-scheme-controls'
import { renderItem, renderSection } from '../shared/util'


const classes = makeStyles({
  displayOptions: {
    marginTop: '0.625rem',
  },
})

const MapLayerDisplay = () => {
  // common actions

  // common state

  return (
    <div className={classes.displayOptions}>
      {renderSection('Layer Display',
        <>
          {renderItem('Color Scheme',
            <ColorSchemeControls />
          )}
        </>
      )}
    </div>
  )
}

export default MapLayerDisplay
