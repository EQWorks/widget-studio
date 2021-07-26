import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Plot from 'react-plotly.js'
import { Button, Loader } from '@eqworks/lumen-ui'
import { ErrorBoundary } from './helper'
import chartDefaults from './components/charts/chart-defaults'

const Widget = props => {

  var config
  if (props.config) {
    config = props.config
  } else {
    // fetch config from id
    throw new Error('not implemented')
  }

  const chartProps = {
    data: config.data,
    ...chartDefaults[config.type]
  }

  const [revision, setRevision] = useState(0) // if chart needs to be resized
  return (
    <Loader open={!config.data || !config.data.length}>
      <ErrorBoundary>
        <Plot
          revision={revision} // if chart needs to be resized
          {...chartProps}
        />
        <Button
          onClick={() => setRevision(revision + 1)}
          type='tertiary'>
          resize
        </Button>

      </ErrorBoundary>
    </Loader>
  )
}

Widget.propTypes = {
  config: PropTypes.object,
  id: PropTypes.number
}
Widget.default = {
  columns: [],
  rows: [],
}

export default Widget
