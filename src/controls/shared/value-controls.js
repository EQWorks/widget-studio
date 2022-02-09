import React from 'react'

import { Icons } from '@eqworks/lumen-labs'

import modes from '../../constants/modes'
import aggFunctions from '../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import PluralLinkedSelect from '../../components/plural-linked-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderSection } from './util'
import MutedBarrier from './muted-barrier'


const ValueControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const resetValue = useStoreActions(actions => actions.resetValue)

  // common state
  const group = useStoreState((state) => state.group)
  const domain = useStoreState((state) => state.domain)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const numericColumns = useStoreState((state) => state.numericColumns)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const renderGroupedValueKeysSelect =
    <PluralLinkedSelect
      headerIcons={[
        Icons.Columns,
        Icons.Sum,
      ]}
      staticQuantity={mode === modes.QL ? 3 : undefined}
      titles={['Column', 'Operation']}
      values={valueKeys}
      primaryKey='key'
      secondaryKey='agg'
      data={numericColumns.filter(c => c !== domain.value)}
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
    <MutedBarrier mute={!domain.value}>
      <WidgetControlCard
        clear={() => resetValue({ valueKeys })}
        title='Value Configuration'
        {...mode === modes.QL &&
        { description: 'Select up to 3 keys, open in editor for more options.' }
        }
      >
        {
          renderSection(null,
            group
              ? renderGroupedValueKeysSelect
              : renderRow('Columns',
                <CustomSelect
                  fullWidth
                  multiSelect
                  value={valueKeys.map(({ key }) => key)}
                  data={numericColumns.filter(c => c !== domain.value)}
                  onSelect={(val) => update({ valueKeys: val.map(v => ({ key: v })) })}
                />
              )
          )
        }
      </WidgetControlCard>
    </MutedBarrier>

  )
}

export default ValueControls
