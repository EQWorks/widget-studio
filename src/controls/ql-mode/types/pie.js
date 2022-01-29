import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const PieControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const donut = useStoreState((state) => state.options.donut)
  const showPercentage = useStoreState((state) => state.options.showPercentage)

  return (
    <WidgetControlCard
      clearable
      title='Styling'
    >
      <CustomToggle
        value={donut}
        label='Donut'
        onChange={(val) => nestedUpdate({ options: { donut: val } })}
      />
      <CustomToggle
        value={showPercentage}
        label='Show Percentage'
        onChange={(val) => nestedUpdate({ options: { showPercentage: val } })}
      />
    </WidgetControlCard>
  )
}

export default PieControls
