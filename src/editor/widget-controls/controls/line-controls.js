import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import {
  Toggle,
  WidgetControlCard as Card,
} from '../../shared-components'
import { ValueControls } from '../../data-controls'
import { GenericOptionControls } from '../shared-controls'

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

      <Card title='Styling'>
        <Toggle
          value={spline}
          label='Spline interpolation'
          update={(val) => nestedUpdate({ options: { spline: val } })}
        />
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => nestedUpdate({ options: { showTicks: val } })}
        />
      </Card>
    </>
  )
}

export default LineControls
