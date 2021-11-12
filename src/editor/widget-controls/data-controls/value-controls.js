import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { aggFuncDict } from '../../../view/adapter'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import PluralLinkedSelect from '../../shared-components/plural-linked-select'
import WidgetControlCard from '../../shared-components/widget-control-card'
import { SwitchRect } from '@eqworks/lumen-labs'
import clsx from 'clsx'


const ValueControls = ({ groupingOptional }) => {

  // common actions
  const update = useStoreActions(actions => actions.update)

  // common state
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)

  useEffect(() => {
    if (!group && !groupingOptional) {
      update({ group: true })
    }
  }, [group, groupingOptional, update])

  const toggleGroup = () => {
    update({ group: !group })
    update({ valueKeys: [] })
  }

  const groupedValueKeysSelect =
    <PluralLinkedSelect
      titles={['Key', 'Aggregation']}
      values={valueKeys}
      primaryKey='key'
      secondaryKey='agg'
      data={numericColumns}
      subData={groupKey ? Object.keys(aggFuncDict) : []}
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

  return (
    <>
      {
        groupingOptional ?
          <>
            <WidgetControlCard
              clearable
              title={group ? 'Group By' : 'Index By'}
            >
              <div className='flex mb-2 text-xs text-secondary-600'>
                <span className='flex-1'>Group By:</span>
                <span className={clsx('font-semibold mr-2', {
                  ['text-secondary-600']: !group,
                  ['text-secondary-500']: group,
                })}>OFF</span>
                <SwitchRect
                  id='group'
                  checked={group}
                  onChange={toggleGroup}
                />
                <span className={clsx('font-semibold ml-2', {
                  ['text-primary-500']: group,
                  ['text-secondary-500']: !group,
                })}>ON</span>
              </div>
              <CustomSelect
                data={group ? stringColumns : numericColumns.filter(c => !(valueKeys.map(({ key }) => key).includes(c)))}
                value={group ? groupKey : indexKey}
                onSelect={val => update(group ? { groupKey: val } : { indexKey: val })}
                placeholder={`Select a column to ${group ? 'group' : 'index'} by`}
              />
            </WidgetControlCard>
            {
              group ?
                <WidgetControlCard grow clearable title='Value Keys'>
                  groupedValueKeysSelect
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
          :
          <>
            <WidgetControlCard
              clearable
              title='Group By'
            >
              <CustomSelect
                data={stringColumns}
                value={groupKey}
                onSelect={val => update({ groupKey: val })}
              />
            </WidgetControlCard>
            <WidgetControlCard
              grow
              clearable
              title='Value Keys'
              description='Select up to 3 keys, open in editor for more options.'
            >
              {groupedValueKeysSelect}
            </WidgetControlCard>
          </>
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
