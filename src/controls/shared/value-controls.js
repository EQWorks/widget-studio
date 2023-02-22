import React, { useCallback, useMemo } from 'react'

import { TextField, Icons, makeStyles } from '@eqworks/lumen-labs'

import modes from '../../constants/modes'
import cardTypes from '../../constants/card-types'
import aggFunctions from '../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../store'
import PluralLinkedSelect from '../../components/plural-linked-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderItem, renderRow, renderSection, renderSuperSection } from './util'
import MutedBarrier from './muted-barrier'
import CustomSelect from '../../components/custom-select'
import types from '../../constants/types'
import { cleanUp } from '../../util/string-manipulation'
import { hasDevAccess } from '../../util/access'


const classes = makeStyles({
  valueContainer: {
    width: '100%',
  },
  textContainer: {
    width: '100%',
    '& .textfield-container': {
      display: 'inline',
      '& form': {
        '& div': {
          '& textarea': {
            letterSpacing: '.1em',
          },
        },
      },
    },
  },
})

const textfieldClasses = Object.freeze({
  container: 'textfield-container',
})

const ValueControls = () => {
  // common actions
  const { userUpdate, resetValue } = useStoreActions(actions => actions)

  // common state
  const addUserControls = useStoreState((state) => state.addUserControls)
  const chart2ValueKeys = useStoreState((state) => state.chart2ValueKeys)
  const columnNameAliases = useStoreState((state) => state.columnNameAliases)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const domain = useStoreState((state) => state.domain)
  const group = useStoreState((state) => state.group)
  const type = useStoreState((state) => state.type)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const eligibleColumns = useMemo(() =>
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) => c !== domain.value && isNumeric
        && !chart2ValueKeys.find(({ key }) => key === c))
    ), [columnsAnalysis, domain.value, chart2ValueKeys])

  const eligibleChart2Columns = useMemo(() =>
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) => c !== domain.value && isNumeric
        && !valueKeys.find(({ key }) => key === c))
    ), [columnsAnalysis, domain.value, valueKeys])

  const staticQuantity = useMemo(() => {
    if (addUserControls || type === types.PYRAMID) {
      return 2
    }
    return 3
  }, [addUserControls, type])

  const renderPluralLinkedSelect = useCallback((valueKeys, eligibleColumns, selectType) => (
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
          userUpdate({
            [selectType === types. BAR ? 'valueKeys' : 'chart2ValueKeys']: valueKeysCopy,
          })
        } else {
          userUpdate({
            [selectType === types. BAR ? 'valueKeys' : 'chart2ValueKeys']: valueKeys.map((v, _i) => i === _i ? val : v),
          })
        }
      }}
      deleteCallback={(i) => {
        const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
        valueKeysCopy.splice(i, 1)
        userUpdate({
          [selectType === types. BAR ? 'valueKeys' : 'chart2ValueKeys']: valueKeysCopy,
        })
      }}
      addMessage='Add Value'
    />
  ),[mode, addUserControls, type, dataHasVariance, staticQuantity, userUpdate, widgetControlCardEdit])

  const renderGroupedValueKeysSelect = renderSuperSection(
    <div className={classes.valueContainer}>
      {renderSection(type === types.BARLINE ? cleanUp(types.BAR) : '',
        renderPluralLinkedSelect(valueKeys, eligibleColumns, types.BAR),
      )}
      {type === types.BARLINE && renderSection(cleanUp(types.LINE),
        renderPluralLinkedSelect(chart2ValueKeys, eligibleChart2Columns, types.LINE),
      )}
    </div>
  )

  const renderNonGroupedValueKeysSelect = renderItem(
    type === types.TEXT ? 'Text' : 'Columns',
    type === types.TEXT
      ? <div className={classes.textContainer}>
        <TextField.Area
          classes={textfieldClasses}
          value={typeof valueKeys[0]?.text === 'string' ? valueKeys[0]?.text : ''}
          inputProps={{ placeholder: 'Add widget text' }}
          onChange={(val) => userUpdate(
            { valueKeys: [{ text: typeof val === 'string' ? val : '' }] }
          )}
        />
      </div>
      : <CustomSelect
        fullWidth
        multiSelect
        value={valueKeys.map(({ key }) => key)}
        data={Object.keys(eligibleColumns)}
        onSelect={(val) => userUpdate({ valueKeys: val.map(v => ({ key: v })) })}
        icons={Object.values(eligibleColumns).map(({ Icon }) => Icon)}
      />,
  )

  return (
    <MutedBarrier
      mute={!type || (type !== types.TEXT && (!domain.value || !Object.keys(eligibleColumns)?.length))}
      {...(type && (type !== types.TEXT && domain.value && !Object.keys(eligibleColumns)?.length &&
        { message: 'There are no eligible columns in this dataset.' })
      )}
    >
      <WidgetControlCard
        clear={() => {
          Object.keys(columnNameAliases).forEach(key => {
            if (JSON.stringify(valueKeys).includes(key) || JSON.stringify(chart2ValueKeys).includes(key)) {
              delete columnNameAliases[key]
            }
          })
          userUpdate({
            aliasesReseted: true,
            columnNameAliases,
          })
          resetValue({ valueKeys, chart2ValueKeys })
        }}
        title='Value Configuration'
        {...mode === modes.QL && { description: 'Select up to 3 keys, open in editor for more options.' }}
        enableEdit={type !== types.TEXT}
        disableEditButton={mode === modes.QL ||
          (!hasDevAccess() && (valueKeys?.length >= 1 || chart2ValueKeys.length >= 1)) ||
          ((valueKeys.every(({ key }) => !key) && chart2ValueKeys.every(({ key }) => !key)) &&
          !widgetControlCardEdit[cardTypes.VALUE])
        }
        type={cardTypes.VALUE}
      >
        {
          group || widgetControlCardEdit[cardTypes.VALUE]
            ? renderRow(null, renderGroupedValueKeysSelect)
            : renderNonGroupedValueKeysSelect
        }
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default ValueControls
