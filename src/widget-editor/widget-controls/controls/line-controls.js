import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../../store'
import { aggOps } from './util/constants'
import {
  Dropdown,
  Toggle,
  PluralLinkedSelect,
  WidgetControlCard as Card,
  ToggleableCard
} from '../../shared-components'

const LineControls = ({ numericColumns, stringColumns }) => {

  const indexBy = useStoreState((state) => state.line.indexBy)
  const spline = useStoreState((state) => state.line.spline)
  const showTicks = useStoreState((state) => state.line.showTicks)
  const x = useStoreState((state) => state.line.x)
  const keys = useStoreState((state) => state.line.keys)
  const lineUpdate = useStoreActions(actions => actions.line.update)

  return (
    <>
      <Card title='Value Keys'>
        <PluralLinkedSelect
          valuePairs={keys}
          titles={['Key', 'Aggregation']}
          data={numericColumns}
          subData={indexBy ? aggOps : []}
          update={(val) => lineUpdate({ keys: val })}
        />
      </Card>

      <ToggleableCard
        init={!!indexBy}
        title='Index Key'
        update={(val) => {
          if (!val) {
            lineUpdate({ indexBy: null })
          }
        }}
      >
        <Dropdown
          data={stringColumns}
          value={indexBy}
          update={val => lineUpdate({ indexBy: val })}
        />
      </ToggleableCard>

      <Card title={'X Key'}>
        <Dropdown
          data={stringColumns.concat(numericColumns)}
          value={x}
          update={val => lineUpdate({ x: val })}
        />
      </Card>

      <Card title='Styling'>
        <Toggle
          value={spline}
          label='Spline interpolation'
          update={(val) => lineUpdate({ spline: val })}
        />
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => lineUpdate({ showTicks: val })}
        />
      </Card>
    </>
  )
}

LineControls.propTypes = {
  numericColumns: PropTypes.array.isRequired,
  stringColumns: PropTypes.array.isRequired
}

export default LineControls
