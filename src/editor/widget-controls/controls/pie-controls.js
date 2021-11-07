import React from 'react'

import modes from '../../../constants/modes'
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

  // ui state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    <>
      <ValueControls groupingOptional={false} />

      {
        mode === modes.EDITOR &&
        <>
          <GenericOptionControls />
          <WidgetControlCard title='Styling'>
            <CustomToggle
              value={donut}
              label='Donut'
              onChange={(val) => nestedUpdate({ options: { donut: val } })}
            />
            <CustomToggle
              value={showPercentage}
              label='Show Percentage'
              onChange={(val) => nestedUpdate({ options: { showPercentage: val } })}
            />
            <CustomToggle
              value={showLegend}
              label='Show Legend'
              onChange={(val) => nestedUpdate({ options: { showLegend: val } })}
            />
          </WidgetControlCard>
        </>
      }
    </>
  )
}

export default PieControls
