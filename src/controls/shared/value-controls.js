import React, { useMemo } from 'react'

import { Icons } from '@eqworks/lumen-labs'

import modes from '../../constants/modes'
import cardTypes from '../../constants/card-types'
import aggFunctions from '../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../store'
import PluralLinkedSelect from '../../components/plural-linked-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow } from './util'
import MutedBarrier from './muted-barrier'
import CustomSelect from '../../components/custom-select'
import types from '../../constants/types'
import { hasDevAccess } from '../../util/access'


const ValueControls = () => {
  // common actions
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const resetValue = useStoreActions(actions => actions.resetValue)

  // common state
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const domain = useStoreState((state) => state.domain)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)
  const columnNameAliases = useStoreState((state) => state.columnNameAliases || {})

  const eligibleColumns = useMemo(() =>
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) => c !== domain.value && isNumeric)
    ), [columnsAnalysis, domain.value])

  const staticQuantity = useMemo(() => {
    if (addUserControls || type === types.PYRAMID) {
      return 2
    }
    return 3
  }, [addUserControls, type])

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const renderGroupedValueKeysSelect =
    <PluralLinkedSelect
      {...(mode === modes.QL || addUserControls || type === types.PYRAMID ? {
        staticQuantity,
      }
        : {
          headerIcons: [
            Icons.Columns,
            Icons.Sum,
            Icons.Alias,
          ],
        })}
      titles={['Column', 'Operation', 'Alias']}
      values={valueKeys}
      valueIcons={Object.values(eligibleColumns).map(({ Icon }) => Icon)}
      primaryKey='key'
      secondaryKey='agg'
      data={Object.keys(eligibleColumns)}
      subData={Object.keys(aggFunctions)}
      disableSubs={!dataHasVariance}
      disableSubMessage="doesn't require aggregation."
      editMode={widgetControlCardEdit[cardTypes.VALUE]}
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
      addMessage='Add Value'
    />

  const renderNonGroupedValueKeysSelect = (
    <CustomSelect
      fullWidth
      multiSelect
      value={valueKeys.map(({ key }) => key)}
      data={Object.keys(eligibleColumns)}
      onSelect={(val) => userUpdate({ valueKeys: val.map(v => ({ key: v })) })}
      icons={Object.values(eligibleColumns).map(({ Icon }) => Icon)}
    />
  )

  return (
    <MutedBarrier
      mute={!type || !domain.value || !Object.keys(eligibleColumns)?.length}
      {...(type && domain.value && !Object.keys(eligibleColumns)?.length &&
        { message: 'There are no eligible columns in this dataset.' }
      )}
    >
      <WidgetControlCard
        clear={() => {
          Object.keys(columnNameAliases).forEach(key => {
            if (JSON.stringify(valueKeys).includes(key)) {
              delete columnNameAliases[key]
            }
          })
          userUpdate({
            aliasesReseted: true,
            columnNameAliases,
          })
          resetValue({ valueKeys })
        }}
        title='Value Configuration'
        {...mode === modes.QL && { description: 'Select up to 3 keys, open in editor for more options.' }}
        enableEdit
        disableEditButton={mode === modes.QL ||
          (!hasDevAccess() && valueKeys?.length === 1) ||
          (valueKeys.every(({ key }) => !key) && !widgetControlCardEdit[cardTypes.VALUE])
        }
        type={cardTypes.VALUE}
      >
        {
          group || widgetControlCardEdit[cardTypes.VALUE]
            ? renderRow(null, renderGroupedValueKeysSelect)
            : renderRow('Columns', renderNonGroupedValueKeysSelect)
        }
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default ValueControls
