import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const BarControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const stacked = useStoreState((state) => state.options.stacked)
  const showTicks = useStoreState((state) => state.options.showTicks)

  return (
    <WidgetControlCard
      clearable
      title='Styling'
    >
      <CustomToggle
        value={stacked}
        label='Stacked'
        onChange={(val) => nestedUpdate({ options: { stacked: val } })}
      />
      <CustomToggle
        value={showTicks}
        label='Show ticks'
        onChange={(val) => nestedUpdate({ options: { showTicks: val } })}
      />
    </WidgetControlCard>
  )
}

export default BarControls
