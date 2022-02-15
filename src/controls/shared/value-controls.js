import React, { useEffect, useMemo } from 'react'

import { Icons } from '@eqworks/lumen-labs'

import modes from '../../constants/modes'
import aggFunctions from '../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../store'
import PluralLinkedSelect from '../../components/plural-linked-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderSection } from './util'
import MutedBarrier from './muted-barrier'
import CustomSelect from '../../components/custom-select'


const ValueControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const resetValue = useStoreActions(actions => actions.resetValue)

  // common state
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const domain = useStoreState((state) => state.domain)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const sortBy = useStoreState((state) => state.sortBy)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)

  const eligibleColumns = useMemo(() =>
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) => c !== domain.value && isNumeric)
    ), [columnsAnalysis, domain.value])

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const allowSortBy = useMemo(() => !group && !columnsAnalysis[domain.value]?.isNumeric && renderableValueKeys.length > 1, [columnsAnalysis, domain.value, group, renderableValueKeys.length])

  // set a default sortBy value if appropriate
  useEffect(() => {
    if (!sortBy) {
      update({ sortBy: renderableValueKeys[0]?.key })
    }
  }, [allowSortBy, renderableValueKeys, sortBy, update])

  const renderGroupedValueKeysSelect =
    <PluralLinkedSelect
      headerIcons={[
        Icons.Columns,
        Icons.Sum,
      ]}
      staticQuantity={mode === modes.QL ? 3 : undefined}
      titles={['Column', 'Operation']}
      values={valueKeys}
      valueIcons={Object.values(eligibleColumns).map(({ Icon }) => Icon)}
      primaryKey='key'
      secondaryKey='agg'
      data={Object.keys(eligibleColumns)}
      subData={Object.keys(aggFunctions)}
      disableSubs={!dataHasVariance}
      disableSubMessage="doesn't require aggregation."
      callback={(i, val) => {
        if (i === valueKeys.length) {
          const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
          valueKeysCopy.push(val)
          userUpdate({ valueKeys: valueKeysCopy })
        } else {
          userUpdate({ valueKeys: valueKeys.map((v, _i) => i === _i ? val : v) })
        }
      }}
      deleteCallback={(i) => {
        const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
        valueKeysCopy.splice(i, 1)
        userUpdate({ valueKeys: valueKeysCopy })
      }}
      addMessage='Add Key'
    />

  return (
    <MutedBarrier
      mute={!dataSourceLoading && (!type || !domain.value || !Object.keys(eligibleColumns)?.length)}
      {...!eligibleColumns.length && { message: 'Sorry, there are no eligible columns in this dataset.' }}
    >
      <WidgetControlCard
        clear={() => resetValue({ valueKeys })}
        title='Value Configuration'
        {...mode === modes.QL &&
        { description: 'Select up to 3 keys, open in editor for more options.' }
        }
      >
        {
          renderSection(null,
            <>
              {
                group
                  ? renderGroupedValueKeysSelect
                  : renderRow('Columns',
                    <CustomSelect
                      fullWidth
                      multiSelect
                      value={valueKeys.map(({ key }) => key)}
                      data={Object.keys(eligibleColumns)}
                      onSelect={(val) => userUpdate({ valueKeys: val.map(v => ({ key: v })) })}
                      icons={Object.values(eligibleColumns).map(({ Icon }) => Icon)}
                    />
                  )
              }
              {
                allowSortBy &&
                renderRow('Sort by',
                  <CustomSelect
                    allowClear={false}
                    value={sortBy}
                    data={renderableValueKeys.map(({ key }) => key)}
                    onSelect={sortBy => userUpdate({ sortBy })}
                  />
                )
              }
            </>
          )
        }
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default ValueControls
