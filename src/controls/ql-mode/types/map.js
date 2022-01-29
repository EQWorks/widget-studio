import React from 'react'

import modes from '../../../constants/modes'
import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const MapControls = () => {
  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const showTooltip = useStoreState((state) => state.options.showTooltip)
  const showLegend = useStoreState((state) => state.options.showLegend)

  // ui state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    mode === modes.EDITOR &&
    <WidgetControlCard
      clearable
      title='Styling'>
      <CustomToggle
        value={showTooltip}
        label='Show Tooltip'
        onChange={(val) => nestedUpdate({ options: { showTooltip: val } })}
      />
      <CustomToggle
        value={showLegend}
        label='Show Legend'
        onChange={(val) => nestedUpdate({ options: { showLegend: val } })}
      />
    </WidgetControlCard>
  )
}

export default MapControls
