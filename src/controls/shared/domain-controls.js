import React, { useMemo, useEffect } from 'react'

import { Chip } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderSection } from './util'
import typeInfo from '../../constants/type-info'
import MutedBarrier from './muted-barrier'


const DomainControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)

  // common state
  const columns = useStoreState((state) => state.columns)
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const domain = useStoreState((state) => state.domain)

  // local state
  const groupingOptional = useMemo(() => typeInfo[type]?.groupingOptional, [type])

  const eligibleDomainValues = useMemo(() => (
    columns.map(({ name }) => name)
      .filter(c => !(valueKeys.map(({ key }) => key).includes(c)))
  ), [columns, valueKeys])

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
                  const mustGroup = columnsAnalysis[val].category !== 'Numeric'
                  if (mustGroup) {
                    update({ group: mustGroup })
                  }
                  const willGroup = mustGroup || group
                  update(willGroup
                    ? { groupKey: val }
                    : { indexKey: val }
                  )
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
                onClear={() => update({
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
