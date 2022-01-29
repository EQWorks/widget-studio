import React from 'react'

import modes from '../../../constants/modes'
import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'
import GenericOptionControls from '../../shared/generic-option-controls'


const LineControls = () => {

  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // unique state
  const spline = useStoreState((state) => state.options.spline)
  const showTicks = useStoreState((state) => state.options.showTicks)

  // ui state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    mode === modes.EDITOR &&
    <>
      <GenericOptionControls />
      <WidgetControlCard
        clearable
        title='Styling'
      >
        <CustomToggle
          value={spline}
          label='Spline interpolation'
          onChange={(val) => nestedUpdate({ options: { spline: val } })}
        />
        <CustomToggle
          value={showTicks}
          label='Show ticks'
          onChange={(val) => nestedUpdate({ options: { showTicks: val } })}
        />
      </WidgetControlCard>
    </>
  )
}

export default LineControls
