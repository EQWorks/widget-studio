import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../shared-components/custom-toggle'
import WidgetControlCard from '../../shared-components/widget-control-card'
import ValueControls from '../data-controls/value-controls'
import GenericOptionControls from '../generic-option-controls'


const BarControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const stacked = useStoreState((state) => state.options.stacked)
  const showTicks = useStoreState((state) => state.options.showTicks)

  return (
    <>
      <ValueControls groupingOptional={false} />
      <GenericOptionControls />

      <WidgetControlCard title='Styling'>
        <CustomToggle
          value={stacked}
          label='Stacked'
          callback={(val) => nestedUpdate({ options: { stacked: val } })}
        />
        <CustomToggle
          value={showTicks}
          label='Show ticks'
          callback={(val) => nestedUpdate({ options: { showTicks: val } })}
        />
      </WidgetControlCard>
    </>
  )
}

export default BarControls
