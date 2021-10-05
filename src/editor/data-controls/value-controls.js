import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { aggOps } from './util/constants'
import { useStoreState, useStoreActions } from '../../store'
import {
  PluralLinkedSelect,
  Toggle,
  WidgetControlCard as Card,
  Dropdown,
} from '../shared-components'
import CustomSelect from '../shared-components/custom-select'


const ValueControls = ({ groupingOptional }) => {

  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

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
    update({ valueKeys: {} })
  }

  const groupedValueKeysSelect =
    <PluralLinkedSelect
      titles={['Key', 'Aggregation']}
      values={valueKeys}
      subKey='agg'
      data={numericColumns}
      subData={groupKey ? aggOps : []}
      update={(val) => nestedUpdate({ valueKeys: val })}
    />
  return (
    <>
      {
        groupingOptional ?
          <>
            <Card
              title={group ? 'Group by' : 'Index by'}
              titleExtra={
                <Toggle
                  value={group}
                  update={toggleGroup} />
              }
            >
              <Dropdown
                data={group ? stringColumns : numericColumns.filter(c => !(c in valueKeys))}
                value={group ? groupKey : indexKey}
                update={val => update(group ? { groupKey: val } : { indexKey: val })}
              />
            </Card>
            <Card title='Value Keys'>
              {
                group ?
                  groupedValueKeysSelect
                  :
                  <CustomSelect
                    multi
                    chosenValue={Object.keys(valueKeys)}
                    data={numericColumns.filter(c => c !== indexKey)}
                    setChosenValue={(val) =>
                      update({
                        valueKeys: {
                          // keep all entries that haven't been removed
                          ...Object.fromEntries(Object.entries(valueKeys).filter(([k]) => val.includes(k))),
                          // add any entries that don't exist yet
                          ...Object.fromEntries(val.filter(k => !(k in valueKeys)).map(k => ([k, { agg: null }])))
                        }
                      })
                    }
                  />
              }
            </Card>
          </>
          :
          <>
            <Card title='Group by' >
              <Dropdown
                data={stringColumns}
                value={groupKey}
                update={val => update({ groupKey: val })}
              />
            </Card>
            <Card title='Value keys' >
              {groupedValueKeysSelect}
            </Card>
          </>
      }
    </>
  )
}
ValueControls.propTypes = {
  groupingOptional: PropTypes.bool
}
ValueControls.defaultProps = {
  groupingOptional: true
}

export default ValueControls
