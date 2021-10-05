import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
// import { getPieChartData, sum } from './utils'
import {
  Toggle,
  WidgetControlCard as Card
} from '../../shared-components'
import { ValueControls } from '../../data-controls'
import { GenericOptionControls } from '../shared-controls'


const PieControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const donut = useStoreState((state) => state.pie.donut)
  const showPercentage = useStoreState((state) => state.pie.showPercentage)
  const showLegend = useStoreState((state) => state.pie.showLegend)

  return (
    <>
      <ValueControls groupingOptional={false} />
      <GenericOptionControls />

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
        <Toggle
          value={showLegend}
          label='Show Legend'
          update={(val) => nestedUpdate({ pie: { showLegend: val } })}
        />
      </Card>
    </>
  )
}

export default PieControls
