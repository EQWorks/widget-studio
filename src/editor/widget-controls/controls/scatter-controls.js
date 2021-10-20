import React from 'react'

import modes from '../../../constants/modes'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../shared-components/custom-select'
import CustomToggle from '../../shared-components/custom-toggle'
import WidgetControlCard from '../../shared-components/widget-control-card'
import ValueControls from '../data-controls/value-controls'
import GenericOptionControls from '../generic-option-controls'


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

  // ui state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    <>
      <ValueControls />

      {
        !groupKey &&
        <WidgetControlCard title={'X Key'}>
          <CustomSelect
            data={stringColumns.concat(numericColumns)}
            chosenValue={indexKey}
            setChosenValue={val => update({ indexKey: val })}
          />
        </WidgetControlCard>
      }

      {
        mode === modes.EDITOR &&
        <>
          <GenericOptionControls />
          <WidgetControlCard title='Styling'>
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
      }
    </>
  )
}

export default ScatterControls
