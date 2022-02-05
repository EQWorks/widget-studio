import React, { useMemo, useEffect } from 'react'

import { Chip } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/widget-control-card'
import { renderBool, renderRow, renderSection } from '../editor-mode/util'
import typeInfo from '../../constants/type-info'
import types from '../../constants/types'
import CustomRadio from '../../components/custom-radio'
import { MAP_LAYER_VIS, MAP_LAYER_GEO_KEYS } from '../../constants/map'


const DomainControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const columns = useStoreState((state) => state.columns)
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const groupByValue = useStoreState((state) => state.genericOptions.groupByValue)

  // local state
  const groupingOptional = useMemo(() => typeInfo[type]?.groupingOptional, [type])
  const domainKey = useMemo(() => {
    if (type === types.MAP) {
      return mapGroupKey
    } if (group) {
      return groupKey
    }
    return indexKey
  }, [group, groupKey, indexKey, mapGroupKey, type])
  const eligibleDomainKeys = useMemo(() => (
    columns.map(({ name }) => name)
      .filter(c =>
        !(valueKeys.map(({ key }) => key).includes(c))
        && (type !== types.MAP || validMapGroupKeys.includes(c))
      )
  ), [columns, type, validMapGroupKeys, valueKeys])
  const mapLayer = useMemo(() => (
    Object.keys(MAP_LAYER_VIS)
      .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
  ), [mapGroupKey])

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
        group && type !== types.MAP &&
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
            data={eligibleDomainKeys}
            value={domainKey}
            onSelect={val => {
              if (type === types.MAP) {
                // update groupKey with mapGroupKey value to have it available if we switch to a chart widget type
                update({ mapGroupKey: val, groupKey: val })
                const newLayer = Object.keys(MAP_LAYER_VIS)
                  .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(val))
                // reset mapValueKeys when we change to a mapGroupKey that requires a different layer, as different layer requires different visualization types
                if (newLayer !== mapLayer) {
                  update({ mapValueKeys: [] })
                }
              } else {
                const mustGroup = columnsAnalysis[val].category !== 'Numeric'
                update({ group: mustGroup })
                const _group = mustGroup || group
                update({ [domainKey]: val })
                // if the new group key is a valid geo key,
                if (_group && validMapGroupKeys.includes(val)) {
                  update({
                  // update mapGroupKey with groupKey value
                    mapGroupKey: val,
                    // reset mapValueKeys in case mapGroupKey value requires a new map layer
                    mapValueKeys: [],
                  })
                }
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
