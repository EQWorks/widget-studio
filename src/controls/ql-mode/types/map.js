import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const MapControls = () => {
  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const showTooltip = useStoreState((state) => state.uniqueOptions.showTooltip)
  const showLegend = useStoreState((state) => state.uniqueOptions.showLegend)

  return (
    <WidgetControlCard
      clearable
      title='Styling'>
      <CustomToggle
        value={showTooltip}
        label='Show Tooltip'
        onChange={(val) => nestedUpdate({ uniqueOptions: { showTooltip: val } })}
      />
      <CustomToggle
        value={showLegend}
        label='Show Legend'
        onChange={(val) => nestedUpdate({ uniqueOptions: { showLegend: val } })}
      />
    </WidgetControlCard>
  )
}

export default MapControls
