import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { aggFuncDict } from '../../../view/adapter'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../shared-components/custom-select'
import CustomToggle from '../../shared-components/custom-toggle'
import PluralLinkedSelect from '../../shared-components/plural-linked-select'
import WidgetControlCard from '../../shared-components/widget-control-card'


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

  const toggleGroup = (val) => {
    update({ group: val })
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
              title={group ? 'Group by' : 'Index by'}
              titleExtra={
                <CustomToggle
                  value={group}
                  callback={toggleGroup} />
              }
            >
              <CustomSelect
                data={group ? stringColumns : numericColumns.filter(c => !(valueKeys.map(({ key }) => key).includes(c)))}
                chosenValue={group ? groupKey : indexKey}
                setChosenValue={val => update(group ? { groupKey: val } : { indexKey: val })}
              />
            </WidgetControlCard>
            <WidgetControlCard title='Value Keys'>
              {
                group ?
                  groupedValueKeysSelect
                  :
                  <CustomSelect
                    multi
                    chosenValue={valueKeys.map(({ key }) => key)}
                    data={numericColumns.filter(c => c !== indexKey)}
                    setChosenValue={(val) =>
                      update({ valueKeys: val.map(v => ({ key: v })) })
                    }
                  />
              }
            </WidgetControlCard>
          </>
          :
          <>
            <WidgetControlCard title='Group by' >
              <CustomSelect
                data={stringColumns}
                chosenValue={groupKey}
                setChosenValue={val => update({ groupKey: val })}
              />
            </WidgetControlCard>
            <WidgetControlCard title='Value keys' >
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
