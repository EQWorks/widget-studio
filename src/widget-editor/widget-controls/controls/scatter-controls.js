import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../../store'
import {
  Dropdown,
  Toggle,
  WidgetControlCard as Card,
} from '../../shared-components'
import { ValueControls } from '../../data-controls'

const ScatterControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const groupBy = useStoreState((state) => state.groupBy)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)

  // unique state
  const showTicks = useStoreState((state) => state.scatter.showTicks)
  const x = useStoreState((state) => state.scatter.x)

  return (
    <>
      <ValueControls />

      {
        !groupBy &&
        <Card title={'X Key'}>
          <Dropdown
            data={stringColumns.concat(numericColumns)}
            value={x}
            update={val => nestedUpdate({ scatter: { x: val } })}
          />
        </Card>
      }

      <Card title='Styling'>
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => nestedUpdate({ scatter: { showTicks: val } })}
        />
      </Card>
    </>
  )
}

ScatterControls.propTypes = {
  numericColumns: PropTypes.array.isRequired,
  stringColumns: PropTypes.array.isRequired
}

export default ScatterControls
