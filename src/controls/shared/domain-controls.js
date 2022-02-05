import React, { useMemo, useEffect } from 'react'

import { Chip } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/widget-control-card'
import { renderBool, renderRow, renderSection } from '../editor-mode/util'
import typeInfo from '../../constants/type-info'
import CustomRadio from '../../components/custom-radio'


const DomainControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const columns = useStoreState((state) => state.columns)
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const groupByValue = useStoreState((state) => state.genericOptions.groupByValue)

  // local state
  const groupingOptional = useMemo(() => typeInfo[type]?.groupingOptional, [type])

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
    <WidgetControlCard title={'Domain Configuration'} >
      {
        group &&
        renderSection(
          null,
          renderBool(
            'Invert Domain',
            groupByValue,
            () => nestedUpdate({ genericOptions: { groupByValue: !groupByValue } })
          )
        )
      }
      {
        renderRow(
          'Column',
          <CustomSelect
            fullWidth
            data={columns.map(({ name }) => name).filter(c => !(valueKeys.map(({ key }) => key).includes(c)))}
            value={group ? groupKey : indexKey}
            onSelect={val => {
              const mustGroup = columnsAnalysis[val].category !== 'Numeric'
              update({ group: mustGroup })
              const _group = mustGroup || group
              update(_group ? { groupKey: val } : { indexKey: val })
              // if the new group key is a valid geo key,
              if (_group && validMapGroupKeys.includes(val)) {
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
      }
      {
        renderRow(
          null,
          <CustomRadio
            update={v => update({ group: v })}
            value={group}
            disableSecond={
              !groupingOptional
              || (group && groupKey && columnsAnalysis[groupKey]?.category !== 'Numeric')
            }
          />
        )
      }
    </WidgetControlCard>
  )
}

export default DomainControls
