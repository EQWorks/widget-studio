import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import {
  Toggle,
  WidgetControlCard as Card
} from '../../shared-components'
import { ValueControls } from '../../data-controls'
import { GenericOptionControls } from '../shared-controls'

const BarControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const stacked = useStoreState((state) => state.bar.stacked)
  const showTicks = useStoreState((state) => state.bar.showTicks)

  return (
    <>
      <ValueControls groupingOptional={false} />
      <GenericOptionControls />

      <Card title='Styling'>
        <Toggle
          value={stacked}
          label='Stacked'
          update={(val) => nestedUpdate({ bar: { stacked: val } })}
        />
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => nestedUpdate({ bar: { showTicks: val } })}
        />
      </Card>
    </>
  )
}

export default BarControls
