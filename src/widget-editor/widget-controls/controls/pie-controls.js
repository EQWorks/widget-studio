import React from 'react'

import PropTypes from 'prop-types'
import { useStoreState, useStoreActions } from '../../../store'
// import { getPieChartData, sum } from './utils'
import {
  Toggle,
  WidgetControlCard as Card
} from '../../shared-components'
import { ValueControls } from '../../data-controls'

const PieControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const donut = useStoreState((state) => state.pie.donut)
  const showPercentage = useStoreState((state) => state.pie.showPercentage)

  return (
    <>
      <ValueControls />

      <Card title='Styling'>
        <Toggle
          value={donut}
          label='Donut'
          update={(val) => nestedUpdate({ pie: { donut: val } })}
        />
        <Toggle
          value={showPercentage}
          label='Show Percentage'
          update={(val) => nestedUpdate({ pie: { showPercentage: val } })}
        />
      </Card>
    </>
  )
}

PieControls.propTypes = {
  columns: PropTypes.array,
}
PieControls.default = {
  columns: [],
}

export default PieControls
