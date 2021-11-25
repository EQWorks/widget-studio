import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { SwitchRect } from '@eqworks/lumen-labs'
import clsx from 'clsx'
import { nanoid } from 'nanoid'

import modes from '../../../constants/modes'
import { aggFuncDict } from '../../../view/adapter'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import PluralLinkedSelect from '../../shared-components/plural-linked-select'
import WidgetControlCard from '../../shared-components/widget-control-card'


const ValueControls = ({ groupingOptional }) => {

  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const zeroVarianceColumns = useStoreState((state) => state.zeroVarianceColumns)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)
  const groupByValue = useStoreState((state) => state.genericOptions.groupByValue)
  const groups = useStoreState((state) => state.groups)
  const filterGroups = useStoreState((state) => state.filterGroups)
  const filters = useStoreState((state) => state.filters)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  useEffect(() => {
    if (!group && !groupingOptional) {
      update({ group: true })
    }
  }, [group, groupingOptional, update])

  const toggleGroup = () => {
    update({ group: !group })
    update({ valueKeys: [] })
  }

  const renderGroupedValueKeysSelect =
    <PluralLinkedSelect
      staticQuantity={mode === modes.QL ? 3 : undefined}
      titles={['Key', 'Aggregation']}
      values={valueKeys}
      primaryKey='key'
      secondaryKey='agg'
      data={numericColumns}
      subData={Object.keys(aggFuncDict)}
      disableSubFor={zeroVarianceColumns}
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
    />

  const renderToggle = (title, state, toggleState) =>
    <div className='flex mb-2 text-xs text-secondary-600'>
      <span className='flex-1'>{title}:</span>
      <span className={clsx('font-semibold mr-2', {
        ['text-secondary-600']: !state,
        ['text-secondary-500']: state,
      })}>OFF</span>
      <SwitchRect
        id={nanoid()}
        checked={state ?? false}
        onChange={toggleState}
      />
      <span className={clsx('font-semibold ml-2', {
        ['text-primary-500']: state,
        ['text-secondary-500']: !state,
      })}>ON</span>
    </div>

  return (
    <>
      <WidgetControlCard
        clearable
        title={group ? 'Group By' : 'Index By'}
      >
        {groupingOptional && renderToggle('Group By', group, toggleGroup)}
        {
          group &&
          renderToggle('By Value', groupByValue, () => nestedUpdate({ genericOptions: { groupByValue: !groupByValue } }))
        }
        <CustomSelect
          data={group ? stringColumns : numericColumns.filter(c => !(valueKeys.map(({ key }) => key).includes(c)))}
          value={group ? groupKey : indexKey}
          onSelect={val => update(group ? { groupKey: val } : { indexKey: val })}
          placeholder={`Select a column to ${group ? 'group' : 'index'} by`}
        />
        {
          group &&
          <div className='mt-2'>
            {
              renderToggle('Filter', filterGroups, () => update({ filterGroups: !filterGroups }))
            }
            {
              filterGroups &&
              <CustomSelect
                multiSelect
                data={groups}
                value={filters[groupKey] ?? []}
                onSelect={val => nestedUpdate({ filters: { [groupKey]: val } })}
                placeholder={`Filter ${groupKey}`}
              />
            }
          </div>
        }
      </WidgetControlCard>
      {
        group ?
          <WidgetControlCard
            grow
            clearable
            title='Value Keys'
            description={mode === modes.QL ? 'Select up to 3 keys, open in editor for more options.' : ''}
          >
            {renderGroupedValueKeysSelect}
          </WidgetControlCard>
          :
          <WidgetControlCard clearable title='Value Keys'>
            <div className='flex-grow-0'>
              <CustomSelect
                multiSelect
                value={valueKeys.map(({ key }) => key)}
                data={numericColumns.filter(c => c !== indexKey)}
                onSelect={(val) =>
                  update({ valueKeys: val.map(v => ({ key: v })) })
                }
              />
            </div>
          </WidgetControlCard>
      }
    </>
  )
}
ValueControls.propTypes = {
  groupingOptional: PropTypes.bool,
}
ValueControls.defaultProps = {
  groupingOptional: true,
}

export default ValueControls
