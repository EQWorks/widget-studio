import React, { useEffect } from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderSection, renderToggle } from './util'
import types from '../../constants/types'


const DataTransformationControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const percentageMode = useStoreState((state) => state.percentageMode)
  const groupByValue = useStoreState((state) => state.genericOptions.groupByValue)

  useEffect(() => {
    if (!group || type === types.PIE) {
      update({ percentageMode: false })
    }
  }, [group, type, update])

  return (
    <WidgetControlCard title='Data Transformations' >
      {
        renderSection(
          null,
          renderRow(
            null,
            <>
              {
                renderToggle(
                  'Invert Domain',
                  groupByValue,
                  () => nestedUpdate({ genericOptions: { groupByValue: !groupByValue } }),
                  type === types.MAP
                )
              }
              {
                renderToggle(
                  'Percentage Mode',
                  percentageMode,
                  () => update({ percentageMode: !percentageMode }),
                  type === types.MAP || (!group || type === types.PIE)
                )
              }
            </>
          )
        )
      }
    </WidgetControlCard>
  )
}

export default DataTransformationControls
