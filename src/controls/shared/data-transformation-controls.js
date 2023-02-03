import React, { useEffect } from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderToggle } from './util'
import types from '../../constants/types'
import MutedBarrier from './muted-barrier'


const DataTransformationControls = () => {
  const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const percentageMode = useStoreState((state) => state.percentageMode)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const groupByValue = useStoreState((state) => state.genericOptions.groupByValue)

  useEffect(() => {
    if (!group || [types.PIE, types.PYRAMID].includes(type)) {
      update({ percentageMode: false })
    }
  }, [group, type, update])

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length}>
      <WidgetControlCard title='Data Transformations' >
        {
          renderRow(
            null,
            <>
              {
                renderToggle(
                  'Invert Domain',
                  groupByValue,
                  () => userUpdate({ genericOptions: { groupByValue: !groupByValue } }),
                  [types.MAP, types.PYRAMID, types.TABLE].includes(type)
                )
              }
              {
                renderToggle(
                  'Percentage Mode',
                  percentageMode,
                  () => userUpdate({ percentageMode: !percentageMode }),
                  type === types.MAP || (!group || [types.PIE, types.PYRAMID].includes(type))
                )
              }
            </>
          )
        }
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default DataTransformationControls
