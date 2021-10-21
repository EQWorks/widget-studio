import React from 'react'

import modes from '../../../constants/modes'
import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../shared-components/custom-toggle'
import WidgetControlCard from '../../shared-components/widget-control-card'
import MapValueControls from '../data-controls/map-value-controls'


const MapControls = () => {
  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const showTooltip = useStoreState((state) => state.options.showTooltip)
  const showLegend = useStoreState((state) => state.options.showLegend)

  // ui state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    <>
      <MapValueControls />
      {mode === modes.EDITOR &&
        <WidgetControlCard title='Styling'>
          <CustomToggle
            value={showTooltip}
            label='Show Tooltip'
            callback={(val) => nestedUpdate({ options: { showTooltip: val } })}
          />
          <CustomToggle
            value={showLegend}
            label='Show Legend'
            callback={(val) => nestedUpdate({ options: { showLegend: val } })}
          />
        </WidgetControlCard>
      }
    </>
  )
}

export default MapControls
