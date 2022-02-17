import React, { useEffect } from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderItem, renderRow, renderSection, renderToggle } from './util'
import types from '../../constants/types'
import MutedBarrier from './muted-barrier'
import { DATE_RESOLUTIONS } from '../../constants/time'
import CustomSelect from '../../components/custom-select'


const DataTransformationControls = () => {
  const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const percentageMode = useStoreState((state) => state.percentageMode)
  const dateAggregation = useStoreState((state) => state.dateAggregation)
  const domainIsDate = useStoreState((state) => state.domainIsDate)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const groupByValue = useStoreState((state) => state.genericOptions.groupByValue)

  useEffect(() => {
    if (!group || type === types.PIE) {
      update({ percentageMode: false })
    }
  }, [group, type, update])

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length}>
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
                    () => userUpdate({ genericOptions: { groupByValue: !groupByValue } }),
                    type === types.MAP
                  )
                }
                {
                  renderToggle(
                    'Percentage Mode',
                    percentageMode,
                    () => userUpdate({ percentageMode: !percentageMode }),
                    type === types.MAP || (!group || type === types.PIE)
                  )
                }
                {
                  renderItem(
                    'Aggregate Dates',
                    <CustomSelect
                      allowClear={false}
                      data={Object.values(DATE_RESOLUTIONS)}
                      value={domainIsDate && group && dateAggregation}
                      placeholder='N/A'
                      onSelect={v => v && userUpdate({ dateAggregation: v })}
                      disabled={!domainIsDate || !group}
                    />
                  )
                }
              </>
            )
          )
        }
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default DataTransformationControls
