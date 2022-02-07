import React, { useMemo, useEffect } from 'react'

import { Chip } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderSection } from '../editor-mode/util'
import typeInfo from '../../constants/type-info'
import types from '../../constants/types'
import CustomRadio from '../../components/custom-radio'
import { MAP_LAYER_VIS, MAP_LAYER_GEO_KEYS } from '../../constants/map'


const DomainControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)

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

  // local state
  const groupingOptional = useMemo(() => typeInfo[type]?.groupingOptional, [type])
  const [domainKey, domainValue] = useMemo(() => {
    let res = {}
    if (type === types.MAP) {
      res = { mapGroupKey }
    } else if (!group) {
      res = { indexKey }
    } else {
      res = { groupKey }
    }
    return Object.entries(res)[0]
  }, [group, groupKey, indexKey, mapGroupKey, type])

  const eligibleDomainValues = useMemo(() => (
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
        renderSection(null,
          renderRow('Column',
            <CustomSelect
              fullWidth
              data={eligibleDomainValues}
              value={domainValue}
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
        )
      }
      {
        renderRow(
          null,
          <CustomRadio
            labels={['Group By', 'Index By']}
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
