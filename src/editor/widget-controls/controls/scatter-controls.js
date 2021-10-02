import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import {
  Dropdown,
  Toggle,
  WidgetControlCard as Card,
} from '../../shared-components'
import { ValueControls } from '../../data-controls'

const ScatterControls = () => {

  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const groupKey = useStoreState((state) => state.groupKey)
  const indexKey = useStoreState((state) => state.indexKey)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)

  // unique state
  const showTicks = useStoreState((state) => state.options.showTicks)
  const showLines = useStoreState((state) => state.options.showLines)

  return (
    <>
      <ValueControls />

      {
        !groupKey &&
        <Card title={'X Key'}>
          <Dropdown
            data={stringColumns.concat(numericColumns)}
            value={indexKey}
            update={val => update({ indexKey: val })}
          />
        </Card>
      }

      <Card title='Styling'>
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => nestedUpdate({ options: { showTicks: val } })}
        />
        <Toggle
          value={showLines}
          label='Show lines'
          update={(val) => nestedUpdate({ scatter: { showLines: val } })}
        />
      </Card>
    </>
  )
}

export default ScatterControls
