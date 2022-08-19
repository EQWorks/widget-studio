import React, { useMemo } from 'react'

import { useStoreState, useStoreActions } from '../../../store'

import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'


const TrendControls = () => {
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const resetValue = useStoreActions((state) => state.userUpdate)

  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)

  const availableTrend = useMemo(() => columns.map(val => val.name), [columns] )

  const parseTrendObject = (val) => {
    let getTrendObject = {}
    const selectedTrend = []
    rows.forEach(row => {
      const objectKeys = Object.keys(row)
      objectKeys.forEach(k => {
        val.forEach(v => {
          if (row[domain.value] === Number(groupFilter[0]) && k.includes(v)) {
            selectedTrend.push(k)

            getTrendObject = {
              ...getTrendObject,
              [k]: row[k],
            }
          }
        })
      })
    })

    return { ...getTrendObject, selectedTrend }
  }

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !groupFilter.length}>
      <WidgetControlCard
        title='Trend Config'
        clear={() => resetValue({ uniqueOptions })}
      >
        <div className="row-container">
          {(renderRow(`Select a column ${renderableValueKeys.length && `up to (${renderableValueKeys.length})`}`,
            <CustomSelect
              fullWidth
              multiSelect
              data={availableTrend}
              onSelect={val => {
                userUpdate({
                  uniqueOptions: {
                    compareTrend: {
                      value: parseTrendObject(val),
                    },
                  },
                })
              }}
              limit={renderableValueKeys.length}
              onClear={() => userUpdate({
                uniqueOptions: {
                  compareTrend: {
                    value: [],
                  },
                },
              })}
              placeholder={'Select a column to compare'}
            />
          ))}
        </div>
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default TrendControls
