import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

// import { makeStyles } from '@material-ui/core/styles'
import Plot from 'react-plotly.js'
import Paper from '@material-ui/core/Paper'
import { Typography, Button } from '@eqworks/lumen-ui'
import { ErrorBoundary } from './helper'
import { getChart } from './components/charts'


// const useStyles = makeStyles((theme) => ({
// }))

const EditMode = ({ type, results, xAxis, yAxis, columns }) => {
  // const classes = useStyles()
  const chartRef = useRef(null)
  const [num, setNum] = useState(0)
  const { props, getControl, ready } = getChart(type || 'bar')({ columns, xAxis, yAxis, results })

  return (
    <div style={{ display: 'flex' }}>
      <Paper ref={chartRef} style={{ height: 500, margin: '0 16px 16px 0', width: '75%', paddingBottom: 50 }}>
        {(ready) &&
          <ErrorBoundary>
            <Plot
              revision={num}
              {...props}
            />
            <Button onClick={() => setNum(num+1)} type='tertiary'>Resize</Button>
          </ErrorBoundary>
        }
      </Paper>
      <Paper style={{ width: '25%', marginBottom: 16, padding: 16 }}>
        <Typography> Control Panel</Typography>
        {/* TODO Add title option in control and pass current state to getControl() */}
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
  yAxis: PropTypes.string.isRequired,
}
EditMode.default = {
  columns: [],
  results: [],
}

export default EditMode
