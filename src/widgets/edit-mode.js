import React, { useRef } from 'react'
import PropTypes from 'prop-types'

// import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'

import { Typography, Button } from '@eqworks/lumen-ui'
import { downloadChart, ErrorBoundary } from './helper'
import { getChart } from './components/charts'


// const useStyles = makeStyles((theme) => ({
// }))

const EditMode = ({ type, results, xAxis, yAxis, columns }) => {
  // const classes = useStyles()
  const chartRef = useRef(null)
  const { Chart, props, getControl } = getChart(type || 'bar')({ columns, xAxis, yAxis })

  return (
    <div style={{ display: 'flex' }}>
      <Paper ref={chartRef} style={{ height: 500, margin: '0 16px 16px 0', width: '75%' }}>
        <Button size='small' type='tertiary' onClick={() => downloadChart(chartRef)} > Download </Button>
        {(results.length && type) &&
          <ErrorBoundary>
            <Chart data={results} {...props}/>
          </ErrorBoundary>
        }
      </Paper>
      <Paper style={{ width: '25%', marginBottom: 16, padding: 16 }}>
        <Typography> Control Panel</Typography>
        {/* Button to reopen modal and change chart type here */}
        {/* Add title option in control */}
        {getControl()}
      </Paper>
    </div>
  )
}

EditMode.propTypes = {
  results: PropTypes.array,
  columns: PropTypes.array,
  type: PropTypes.string.isRequired,
  xAxis: PropTypes.string.isRequired,
  setXAxis: PropTypes.func.isRequired,
  yAxis: PropTypes.string.isRequired,
  setYAxis: PropTypes.func.isRequired,
}
EditMode.default = {
  columns: [],
  results: [],
}

export default EditMode
