import React from 'react'

import modes from '../../../constants/modes'
import { useStoreState, useStoreActions } from '../../../store'
import CustomToggle from '../../../components/custom-toggle'
import WidgetControlCard from '../../shared/widget-control-card'
import GenericOptionControls from '../../shared/generic-option-controls'


const ScatterControls = () => {

  // common actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // unique state
  const showTicks = useStoreState((state) => state.options.showTicks)
  const showLines = useStoreState((state) => state.options.showLines)

  // ui state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    mode === modes.EDITOR &&
    <>
      <GenericOptionControls />
      <WidgetControlCard
        clearable
        title='Styling'
      >
        <CustomToggle
          value={showTicks}
          label='Show ticks'
          callback={(val) => nestedUpdate({ options: { showTicks: val } })}
        />
        <CustomToggle
          value={showLines}
          label='Show lines'
          callback={(val) => nestedUpdate({ scatter: { showLines: val } })}
        />
      </WidgetControlCard>
    </>
  )
}

export default ScatterControls
