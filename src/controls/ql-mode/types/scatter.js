import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const ScatterControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const showTicks = useStoreState((state) => state.uniqueOptions.showTicks)
  const showLines = useStoreState((state) => state.uniqueOptions.showLines)

  return (
    <WidgetControlCard
      clearable
      title='Styling'
    >
      <CustomToggle
        value={showTicks}
        label='Show ticks'
        callback={(val) => nestedUpdate({ uniqueOptions: { showTicks: val } })}
      />
      <CustomToggle
        value={showLines}
        label='Show lines'
        callback={(val) => nestedUpdate({ scatter: { showLines: val } })}
      />
    </WidgetControlCard>
  )
}

export default ScatterControls
