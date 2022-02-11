import React, { useMemo, useEffect } from 'react'

import { Chip } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderSection } from './util'
import typeInfo from '../../constants/type-info'
import MutedBarrier from './muted-barrier'


const DomainControls = () => {
  const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const resetValue = useStoreActions(actions => actions.resetValue)
  const columns = useStoreState((state) => state.columns)
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const indexKey = useStoreState((state) => state.indexKey)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const domain = useStoreState((state) => state.domain)

  // local state
  const groupingOptional = useMemo(() => typeInfo[type]?.groupingOptional, [type])

  const eligibleGroupKeyValues = useMemo(() => (
    columns.map(({ name }) => name)
      .filter(c => columnsAnalysis[c].category !== 'Numeric' || c.endsWith('_id'))
  ), [columns, columnsAnalysis])

  const eligibleDomainValues = useMemo(() => (
    columns.map(({ name }) => name)
      .filter(c =>
        (groupingOptional || eligibleGroupKeyValues.includes(c))
        && !(valueKeys.map(({ key }) => key).includes(c))
      )
  ), [columns, eligibleGroupKeyValues, groupingOptional, valueKeys])

  useEffect(() => {
    if (!group && !groupingOptional) {
      update({ group: true })
    }
  }, [group, groupingOptional, update])

  const renderCategory = () => {
    const { category } = columnsAnalysis[group ? groupKey : indexKey] || {}
    return (category &&
      <Chip
        selectable={false}
        color={category === 'Numeric' ? 'success' : 'interactive'}
      >
        {category}
      </Chip >
    )
  }

  return (
    <MutedBarrier mute={!type}>
      <WidgetControlCard title={'Domain Configuration'} >
        {
          renderSection(null,
            renderRow('Column',
              <CustomSelect
                fullWidth
                data={eligibleDomainValues}
                value={domain.value}
                onSelect={val => {
                  const willGroup = eligibleGroupKeyValues.includes(val) && !groupingOptional
                  userUpdate({
                    group: willGroup,
                    ...(
                      willGroup
                        ? {
                          groupKey: val,
                          indexKey: null,
                        }
                        : {
                          indexKey: val,
                          groupKey: null,
                        }
                    ),
                  })
                  resetValue({ groupFilter })
                  // if the new group key is a valid geo key,
                  if (willGroup && validMapGroupKeys.includes(val)) {
                    update({
                      // update mapGroupKey with groupKey value
                      mapGroupKey: val,
                      // reset mapValueKeys in case mapGroupKey value requires a new map layer
                      mapValueKeys: [],
                    })
                  }
                }}
                onClear={() => userUpdate({
                  groupKey: null,
                  indexKey: null,
                  mapGroupKey: null,
                  mapValueKeys: [],
                })}
                placeholder={`Select a column to ${group ? 'group' : 'index'} by`}
              />,
              renderCategory()
            )
          )
        }
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default DomainControls
