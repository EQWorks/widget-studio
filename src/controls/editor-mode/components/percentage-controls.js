import React, { useMemo } from 'react'

import { useStoreState, useStoreActions } from '../../../store'

import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'


const PercentageControls = () => {
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const resetValue = useStoreActions((state) => state.resetValue)

  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const columns = useStoreState((state) => state.columns)
  const rows = useStoreState((state) => state.rows)

  const availableColumns = useMemo(() => columns.map(val => val.name), [columns] )

  const handleOnSelect = (val) => {
    const values = []
    const titles = []

    rows.forEach(row => {
      const objectKeys = Object.keys(row)
      objectKeys.forEach(k => {
        val.forEach(v => {
          if (v === k) {
            values.push(row[k])
            titles.push(k)
          }
        })
      })
    })

    return { titles, values }
  }

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !groupFilter.length}>
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
