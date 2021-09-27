import React from 'react'

import PropTypes from 'prop-types'
import { useStoreState, useStoreActions } from '../../../store'
// import { getPieChartData, sum } from './utils'
import { aggOps } from './util/constants'
import {
  Dropdown,
  Toggle,
  PluralLinkedSelect,
  WidgetControlCard as Card
} from '../../shared-components'

const PieControls = ({ numericColumns, stringColumns }) => {

  const indexBy = useStoreState((state) => state.pie.indexBy)
  const keys = useStoreState((state) => state.pie.keys)
  const donut = useStoreState((state) => state.pie.donut)
  const showPercentage = useStoreState((state) => state.pie.showPercentage)
  const pieUpdate = useStoreActions(actions => actions.pie.update)

  return (
    <>
      <Card title='Value Keys'>
        <PluralLinkedSelect
          valuePairs={keys}
          titles={['Key', 'Aggregation']}
          data={numericColumns}
          subData={aggOps}
          update={(val) => pieUpdate({ keys: val })}
        />
      </Card>

      <Card title='Index Key'>
        <Dropdown
          data={stringColumns}
          value={indexBy}
          update={val => pieUpdate({ indexBy: val })}
        />
      </Card>

      <Card title='Styling'>
        <Toggle
          value={donut}
          label='Donut'
          update={(val) => pieUpdate({ donut: val })}
        />
        <Toggle
          value={showPercentage}
          label='Show Percentage'
          update={(val) => pieUpdate({ showPercentage: val })}
        />
      </Card>
    </>
  )
}

PieControls.propTypes = {
  columns: PropTypes.array,
}
PieControls.default = {
  columns: [],
}

export default PieControls
