import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const MapControls = () => {
  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const showTooltip = useStoreState((state) => state.options.showTooltip)
  const showLegend = useStoreState((state) => state.options.showLegend)

  return (
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
