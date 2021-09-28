import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../../store'
import {
  Dropdown,
  Toggle,
  WidgetControlCard as Card,
} from '../../shared-components'
import { ValueControls } from '../../data-controls'

const LineControls = () => {

  // common actions
  const update = useStoreActions((state) => state.update)
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)
  const xKey = useStoreState((state) => state.xKey)

  // unique state
  const spline = useStoreState((state) => state.line.spline)
  const showTicks = useStoreState((state) => state.line.showTicks)

  return (
    <>
      <ValueControls />

      <Card title={'X Key'}>
        <Dropdown
          data={stringColumns.concat(numericColumns)}
          value={xKey}
          update={val => update({ xKey: val })}
        />
      </Card>

      <Card title='Styling'>
        <Toggle
          value={spline}
          label='Spline interpolation'
          update={(val) => nestedUpdate({ line: { spline: val } })}
        />
        <Toggle
          value={showTicks}
          label='Show ticks'
          update={(val) => nestedUpdate({ line: { showTicks: val } })}
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
