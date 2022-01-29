import React from 'react'

import modes from '../../../constants/modes'
import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'
import GenericOptionControls from '../../shared/generic-option-controls'


const BarControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const stacked = useStoreState((state) => state.options.stacked)
  const showTicks = useStoreState((state) => state.options.showTicks)

  // ui state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    <>
      {
        mode === modes.EDITOR &&
        <>
          <GenericOptionControls />
          <WidgetControlCard
            clearable
            title='Styling'
          >
            <CustomToggle
              value={stacked}
              label='Stacked'
              onChange={(val) => nestedUpdate({ options: { stacked: val } })}
            />
            <CustomToggle
              value={showTicks}
              label='Show ticks'
              onChange={(val) => nestedUpdate({ options: { showTicks: val } })}
            />
          </WidgetControlCard>
        </>
      }
    </>
  )
}

export default BarControls
