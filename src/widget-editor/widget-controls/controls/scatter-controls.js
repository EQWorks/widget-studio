import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../../store'
import {
  aggOps,
  Dropdown,
  Toggle,
  PluralLinkedSelect,
  WidgetControlCard as Card,
  ToggleableCard
} from './shared'

const ScatterControls = ({ numericColumns, stringColumns }) => {

  const indexBy = useStoreState((state) => state.scatter.indexBy)
  const showTicks = useStoreState((state) => state.scatter.showTicks)
  const x = useStoreState((state) => state.scatter.x)
  const keys = useStoreState((state) => state.scatter.keys)
  const scatterUpdate = useStoreActions(actions => actions.scatter.update)

  return (
    <>
      <Card title='Value Keys'>
        <PluralLinkedSelect
          valuePairs={keys}
          titles={['Key', 'Aggregation']}
          data={numericColumns}
          subData={indexBy ? aggOps : []}
          update={(val) => scatterUpdate({ keys: val })}
        />
      </Card>

      <ToggleableCard
        init={!!indexBy}
        title='Index Key'
        update={(val) => {
          if (!val) {
            scatterUpdate({ indexBy: null })
          }
        }}
      >
        <Dropdown
          data={stringColumns}
          value={indexBy}
          update={val => scatterUpdate({ indexBy: val })}
        />
      </ToggleableCard>

      {
        !indexBy &&
        <Card title={'X Key'}>
          <Dropdown
            data={stringColumns.concat(numericColumns)}
            value={x}
            update={val => scatterUpdate({ x: val })}
          />
        </Card>
      }

      <Card title='Styling'>
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => scatterUpdate({ showTicks: val })}
        />
      </Card>
    </>
  )
}

ScatterControls.propTypes = {
  numericColumns: PropTypes.array.isRequired,
  stringColumns: PropTypes.array.isRequired
}

export default ScatterControls
