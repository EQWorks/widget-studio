import React from 'react'
import PropTypes from 'prop-types'

import { aggOps } from './util/constants'
import { useStoreState, useStoreActions } from '../../store'
import {
  PluralLinkedSelect,
  ToggleableCard,
  WidgetControlCard as Card,
  Dropdown
} from '../shared-components'

const ValueControls = () => {

  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const groupBy = useStoreState((state) => state.groupBy)
  const yKeys = useStoreState((state) => state.yKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)

  return (
    <>
      <Card title='Value Keys'>
        <PluralLinkedSelect
          titles={['Key', 'Aggregation']}
          values={yKeys}
          subKey='agg'
          data={numericColumns}
          subData={groupBy ? aggOps : []}
          update={(val) => nestedUpdate({ yKeys: val })}
        />
      </Card>

      <ToggleableCard
        init={!!groupBy}
        title='Group by'
        update={(val) => {
          if (!val) {
            update({ groupBy: null })
          }
        }}
      >
        <Dropdown
          data={stringColumns}
          value={groupBy}
          update={val => update({ groupBy: val })}
        />
      </ToggleableCard>
    </>
  )
}
ValueControls.propTypes = {

}

export default ValueControls
