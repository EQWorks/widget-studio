import React, { useMemo } from 'react'

import { useStoreState, useStoreActions } from '../../../store'

import { useGroupFilterValue } from '../../../hooks/use-group-filter'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'
import aggFunctions from '../../../util/agg-functions'


const PercentageControls = () => {
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const resetValue = useStoreActions((state) => state.resetValue)

  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const columns = useStoreState((state) => state.columns)
  const rows = useStoreState((state) => state.rows)

  const availableColumns = useMemo(() => columns.map(val => val.name), [columns] )

  const currentGroupFilter = useGroupFilterValue()

  const handleOnSelect = (val) => {
    const values = []
    let getAggTrendObject = {}

    rows.forEach(row => {
      const objectKeys = Object.keys(row)
      objectKeys.forEach(k => {
        val.forEach((v, i) => {
          if (row[domain.value].toString() === currentGroupFilter[0] && !k.localeCompare(v)) {
            if (renderableValueKeys[i].agg) {
              if (!(k in getAggTrendObject)) {
                getAggTrendObject[k] = []
              }

              getAggTrendObject[k].push(row[k])
            } else {
              values.push(row[k])
            }
          }
        })
      })
    })

    renderableValueKeys.forEach((v, i) => {
      if (v.agg && val[i]) {
        val.forEach((k, i) => {
          values.push(aggFunctions[renderableValueKeys[i].agg](getAggTrendObject[k]))
        })
      }
    })

    return { titles: val, values }
  }

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !currentGroupFilter.length}>
      <WidgetControlCard
        title='Percentage Configuration'
        clear={() => resetValue({ uniqueOptions })}
      >
        <div className="row-container">
          {(renderRow(`Select a column ${renderableValueKeys.length && 'up to 1 column'}`,
            <CustomSelect
              fullWidth
              multiSelect
              data={availableColumns}
              value={uniqueOptions.selectedPercentage && uniqueOptions.selectedPercentage.titles}
              onSelect={val => {
                userUpdate({
                  uniqueOptions: {
                    selectedPercentage: handleOnSelect(val),
                  },
                })
              }}
              limit={renderableValueKeys.length}
              onClear={() => userUpdate({
                uniqueOptions: {
                  selectedPercentage: {
                    titles: [],
                    values: [],
                  },
                },
              })}
              placeholder={'Select a column'}
            />
          ))}
        </div>
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default PercentageControls
