import React, { useMemo, useEffect } from 'react'

import { Icons } from '@eqworks/lumen-labs'

import modes from '../../constants/modes'
import aggFunctions from '../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import PluralLinkedSelect from '../../components/plural-linked-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import typeInfo from '../../constants/type-info'
import { renderSection } from '../editor-mode/util'


const ValueControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)

  // common state
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const numericColumns = useStoreState((state) => state.numericColumns)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  // local state
  const groupingOptional = useMemo(() => typeInfo[type]?.groupingOptional, [type])

  useEffect(() => {
    if (!group && !groupingOptional) {
      update({ group: true })
    }
  }, [group, groupingOptional, update])

  const renderGroupedValueKeysSelect =
    <PluralLinkedSelect
      headerIcons={[
        Icons.Sum,
        Icons.Columns,
      ]}
      staticQuantity={mode === modes.QL ? 3 : undefined}
      titles={['Column', 'Operation']}
      values={valueKeys}
      primaryKey='key'
      secondaryKey='agg'
      data={numericColumns}
      subData={Object.keys(aggFunctions)}
      disableSubs={!dataHasVariance}
      disableSubMessage="doesn't require aggregation."
      callback={(i, val) => {
        if (i === valueKeys.length) {
          const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
          valueKeysCopy.push(val)
          update({ valueKeys: valueKeysCopy })
        } else {
          update({ valueKeys: valueKeys.map((v, _i) => i === _i ? val : v) })
        }
      }}
      deleteCallback={(i) => {
        const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
        valueKeysCopy.splice(i, 1)
        update({ valueKeys: valueKeysCopy })
      }}
      addMessage='Add Key'
    />

  return (
    <WidgetControlCard
      clear={() => window.alert('not implemented')}
      title='Value Configuration'
      {...mode === modes.QL &&
      { description: 'Select up to 3 keys, open in editor for more options.' }
      }
    >
      {
        renderSection(null,
          group
            ? renderGroupedValueKeysSelect
            : <div className='flex-grow-0'>
              <CustomSelect
                multiSelect
                value={valueKeys.map(({ key }) => key)}
                data={numericColumns.filter(c => c !== indexKey)}
                onSelect={(val) => update({ valueKeys: val.map(v => ({ key: v })) })}
              />
            </div>
        )
      }
    </WidgetControlCard>
  )
}

export default ValueControls
