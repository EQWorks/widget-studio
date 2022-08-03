import React, { useMemo } from 'react'

import { useStoreState, useStoreActions } from '../../store'

import WidgetControlCard from './components/widget-control-card'
import { renderRow } from './util'
import MutedBarrier from './muted-barrier'
import CustomSelect from '../../components/custom-select'


const PercentageControls = () => {
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const resetValue = useStoreActions((state) => state.resetValue)

  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)


  const selectedColumns = useMemo(() => {
    resetValue({ uniqueOptions })
    const getValueTitle = renderableValueKeys.map(val => val.key)
    return getValueTitle
  }, [renderableValueKeys, resetValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !groupFilter.length}>
      <WidgetControlCard
        title='Percentage Configuration'
        clear={() => resetValue({ uniqueOptions })}
      >
        <div className="row-container">
          {(renderRow('Compare to first value',
            <CustomSelect
              fullWidth
              multiSelect
              data={selectedColumns}
              value={uniqueOptions.selectedPercentage}
              onSelect={val => {
                userUpdate({
                  uniqueOptions: {
                    selectedPercentage: val,
                  },
                })
              }}
              placeholder={'Select a column'}
            />
          ))}
        </div>
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default PercentageControls
