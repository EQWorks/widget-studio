import React, { useMemo, useEffect } from 'react'

import { Chip, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderItem, renderRow } from './util'
import typeInfo from '../../constants/type-info'
import MutedBarrier from './muted-barrier'
import { DATE_RESOLUTIONS } from '../../constants/time'
import { columnTypeInfo } from '../../constants/columns'


const classes = makeStyles({
  dateGroupByContainer: {
    paddingLeft: '0.8rem',
  },
})


const DomainControls = () => {
  const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const domain = useStoreState((state) => state.domain)
  const domainIsDate = useStoreState((state) => state.domainIsDate)
  const dateAggregation = useStoreState((state) => state.dateAggregation)

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
    const { category } = columnsAnalysis[domain.value] || {}
    return (category &&
      <Chip selectable={false} color={columnTypeInfo[category]?.color} >
        {category}
      </Chip >
    )
  }

  return (
    <MutedBarrier mute={!type}>
      <WidgetControlCard title={'Domain Configuration'} >
        {
          renderRow(null,
            <>
              {
                renderItem('Column',
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
                    placeholder='Select column'
                  />,
                  renderCategory()
                )
              }
              {
                domainIsDate && group &&
                <div className={classes.dateGroupByContainer}>
                  {
                    renderItem(
                      'Group by',
                      <CustomSelect
                        fullWidth
                        allowClear={false}
                        data={Object.values(DATE_RESOLUTIONS)}
                        value={domainIsDate && group && dateAggregation}
                        onSelect={v => v && userUpdate({ dateAggregation: v })}
                      />,
                      null,
                      false
                    )
                  }
                </div>
              }
            </>
          )
        }
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default DomainControls
