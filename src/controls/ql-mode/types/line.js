import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'


const LineControls = () => {

  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // unique state
  const spline = useStoreState((state) => state.uniqueOptions.spline)
  const showTicks = useStoreState((state) => state.uniqueOptions.showTicks)

  return (
    <WidgetControlCard
      clearable
      title='Styling'
    >
      <CustomToggle
        value={spline}
        label='Spline interpolation'
        onChange={(val) => nestedUpdate({ uniqueOptions: { spline: val } })}
      />
      <CustomToggle
        value={showTicks}
        label='Show ticks'
        onChange={(val) => nestedUpdate({ uniqueOptions: { showTicks: val } })}
      />
    </WidgetControlCard>
  )
}

export default LineControls
