import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Plot from 'react-plotly.js'
import { Button } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'
import { ErrorBoundary } from './helper'
import { getChart } from './components/charts'

const Widget = props => {
  const [revision, setRevision] = useState(0) // if chart needs to be resized

  const rows = useStoreState((state) => state.widgets.dataState.rows)
  const columns = useStoreState((state) => state.widgets.dataState.columns)

  const type = useStoreState((state) => state.widgets.initState.type)
  // const ready = useStoreState((state) => state.widgets.controllers.ready)
  const { props: chartProps, getControl } = getChart(type)({ columns, rows })

  return (
    <ErrorBoundary>
      <Plot
        revision={revision} // if chart needs to be resized
        {...chartProps}
      />
      <Button
        onClick={() => setRevision(revision + 1)}
        type='tertiary'>
        Resize
      </Button>
    </ErrorBoundary>
  )
}

Widget.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
}
Widget.default = {
  columns: [],
  rows: [],
}

export default Widget
