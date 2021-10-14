import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../shared-components/custom-toggle'
import WidgetControlCard from '../../shared-components/widget-control-card'
import ValueControls from '../data-controls/value-controls'
import GenericOptionControls from '../generic-option-controls'


const LineControls = () => {

  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // unique state
  const spline = useStoreState((state) => state.options.spline)
  const showTicks = useStoreState((state) => state.options.showTicks)

  return (
    <>
      <ValueControls />
      <GenericOptionControls />

      <WidgetControlCard title='Styling'>
        <CustomToggle
          value={spline}
          label='Spline interpolation'
          update={(val) => nestedUpdate({ options: { spline: val } })}
        />
        <CustomToggle
          value={showTicks}
          label='Show ticks'
          update={(val) => nestedUpdate({ options: { showTicks: val } })}
        />
      </WidgetControlCard>
    </>
  )
}

export default LineControls
