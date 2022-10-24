import React, { useMemo } from 'react'

import { Chip, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import ColumnAliasControls from '../editor-mode/components/column-alias-controls'
import { renderItem, renderRow } from './util'
import typeInfo from '../../constants/type-info'
import cardTypes from '../../constants/card-types'
import MutedBarrier from './muted-barrier'
import { DATE_RESOLUTIONS } from '../../constants/time'
import { columnTypeInfo } from '../../constants/columns'
import { hasDevAccess } from '../../util/access'


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
  const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)

  // local state
  const { mustGroup } = useMemo(() => typeInfo[type] || {}, [type])

  const eligibleDomainValues = useMemo(() => (
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) => (!mustGroup || !isNumeric)
          && !(valueKeys.map(({ key }) => key).includes(c)))
        .map(([c, { Icon }]) => [c, { Icon }])
    )
  ), [columnsAnalysis, mustGroup, valueKeys])

  const renderCategory = () => {
    const { category } = columnsAnalysis[domain.value] || {}
    return (category &&
      <Chip selectable={false} color={columnTypeInfo[category]?.color} >
        {category}
      </Chip >
    )
  }

  return (
    <MutedBarrier
      mute={!type || !Object.keys(eligibleDomainValues)?.length}
      {...(type && !Object.keys(eligibleDomainValues)?.length &&
        { message: 'There are no eligible columns in this dataset.' }
      )}
    >
      <WidgetControlCard
        title={'Domain Configuration'}
        enableEdit={hasDevAccess() && domain.value}
        type={cardTypes.DOMAIN}
      >
        {renderRow(null,
          <>
            {renderItem('Column',
              <CustomSelect
                fullWidth
                data={Object.keys(eligibleDomainValues)}
                icons={Object.values(eligibleDomainValues).map(({ Icon }) => Icon)}
                value={domain.value}
                onSelect={val => {
                  const willGroup = mustGroup || !columnsAnalysis[val]?.isNumeric
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
                placeholder='Select column' />,
              !widgetControlCardEdit[cardTypes.DOMAIN] && renderCategory()
            )}
            {!widgetControlCardEdit[cardTypes.DOMAIN] && domainIsDate && group &&
              <div className={classes.dateGroupByContainer}>
                {renderItem(
                  'Group by',
                  <CustomSelect
                    fullWidth
                    allowClear={false}
                    data={Object.values(DATE_RESOLUTIONS)}
                    value={domainIsDate && group && dateAggregation}
                    onSelect={v => v && userUpdate({ dateAggregation: v })} />,
                  null,
                  false
                )}
              </div>}
            {widgetControlCardEdit[cardTypes.DOMAIN] &&
              renderItem('Alias',
                <ColumnAliasControls
                  value={domain.value || ''}
                  disabled={!domain.value}
                />
              )
            }
          </>
        )}
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default DomainControls
