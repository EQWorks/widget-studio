import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../../store'
import {
  aggOps,
  Dropdown,
  Toggle,
  PluralLinkedSelect,
  WidgetControlCard as Card
} from './shared'

const BarControls = ({ numericColumns, stringColumns }) => {

  const stacked = useStoreState((state) => state.bar.stacked)
  const showTicks = useStoreState((state) => state.bar.showTicks)
  const indexBy = useStoreState((state) => state.bar.indexBy)
  const keys = useStoreState((state) => state.bar.keys)
  const barUpdate = useStoreActions(actions => actions.bar.update)

  return (
    <>
      <Card title='Value Keys'>
        <PluralLinkedSelect
          valuePairs={keys}
          titles={['Key', 'Aggregation']}
          data={numericColumns}
          subData={aggOps}
          update={(val) => barUpdate({ keys: val })}
        />
      </Card>

      <Card title='Index Key'>
        <Dropdown
          data={stringColumns}
          value={indexBy}
          update={val => barUpdate({ indexBy: val })}
        />
      </Card>

      <Card title='Styling'>
        <Toggle
          value={stacked}
          label='Stacked'
          update={(val) => barUpdate({ stacked: val })}
        />
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => barUpdate({ showTicks: val })}
        />
      </Card>
    </>
  )
}

BarControls.propTypes = {
  numericColumns: PropTypes.array.isRequired,
  stringColumns: PropTypes.array.isRequired
}

export default BarControls
