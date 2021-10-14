import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
// import { getPieChartData, sum } from './utils'
import CustomToggle from '../../shared-components/custom-toggle'
import WidgetControlCard from '../../shared-components/widget-control-card'
import ValueControls from '../data-controls/value-controls'
import GenericOptionControls from '../generic-option-controls'


const PieControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const donut = useStoreState((state) => state.options.donut)
  const showPercentage = useStoreState((state) => state.options.showPercentage)
  const showLegend = useStoreState((state) => state.options.showLegend)

  return (
    <>
      <ValueControls groupingOptional={false} />
      <GenericOptionControls />

      <WidgetControlCard title='Styling'>
        <CustomToggle
          value={donut}
          label='Donut'
          update={(val) => nestedUpdate({ options: { donut: val } })}
        />
        <CustomToggle
          value={showPercentage}
          label='Show Percentage'
          update={(val) => nestedUpdate({ options: { showPercentage: val } })}
        />
        <CustomToggle
          value={showLegend}
          label='Show Legend'
          update={(val) => nestedUpdate({ options: { showLegend: val } })}
        />
      </WidgetControlCard>
    </>
  )
}

export default PieControls
