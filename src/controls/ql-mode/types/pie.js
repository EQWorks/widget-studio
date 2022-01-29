import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const PieControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const donut = useStoreState((state) => state.uniqueOptions.donut)
  const showPercentage = useStoreState((state) => state.uniqueOptions.showPercentage)

  return (
    <WidgetControlCard
      clearable
      title='Styling'
    >
      <CustomToggle
        value={donut}
        label='Donut'
        onChange={(val) => nestedUpdate({ uniqueOptions: { donut: val } })}
      />
      <CustomToggle
        value={showPercentage}
        label='Show Percentage'
        onChange={(val) => nestedUpdate({ uniqueOptions: { showPercentage: val } })}
      />
    </WidgetControlCard>
  )
}

export default PieControls
