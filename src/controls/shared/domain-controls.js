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
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) =>
          (groupingOptional || !isNumeric)
          && !(valueKeys.map(({ key }) => key).includes(c)))
        .map(([c, { Icon }]) => [c, { Icon }])
    )
  ), [columnsAnalysis, groupingOptional, valueKeys])

  useEffect(() => {
    if (!group && !groupingOptional) {
      update({ group: true })
    }
  }, [group, groupingOptional, update])

  const renderCategory = () => {
    const { category, isNumeric } = columnsAnalysis[group ? groupKey : indexKey] || {}
    return (category &&
      <Chip
        selectable={false}
        color={isNumeric ? 'success' : 'interactive'}
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
                data={Object.keys(eligibleDomainValues)}
                icons={Object.values(eligibleDomainValues).map(({ Icon }) => Icon)}
                value={domain.value}
                onSelect={val => {
                  const willGroup = !columnsAnalysis[val]?.isNumeric && !groupingOptional
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
                    groupFilter: [],
                  })
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
