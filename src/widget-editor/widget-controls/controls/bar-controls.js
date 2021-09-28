import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../../store'
import {
  Toggle,
  WidgetControlCard as Card
} from '../../shared-components'
import { ValueControls } from '../../data-controls'

const BarControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const stacked = useStoreState((state) => state.bar.stacked)
  const showTicks = useStoreState((state) => state.bar.showTicks)

  return (
    <>
      <ValueControls />

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

BarControls.propTypes = {
  numericColumns: PropTypes.array.isRequired,
  stringColumns: PropTypes.array.isRequired
}

export default BarControls
