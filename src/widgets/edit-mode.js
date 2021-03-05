import React, { useState } from 'react'
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
  const [revision, setRevision] = useState(0) // if chart needs to be resized
  const { props, getControl, ready } = getChart(type || 'bar')({ columns, xAxis, yAxis, results })

  return (
    <div style={{ display: 'flex', marginTop: 10 }}>
      <Paper style={{ minHeight: 500, margin: '0 16px 16px 0', width: '75%', paddingBottom: 50 }}>
        {(ready) &&
          <ErrorBoundary>
            <Plot
              revision={revision} // if chart needs to be resized
              {...props}
            />
            <Button
              onClick={() => setRevision(revision+1)}
              type='tertiary'>
              Resize
            </Button>
          </ErrorBoundary>
        }
      </Paper>
      <Paper style={{ width: '25%', marginBottom: 16, padding: 16 }}>
        <Typography secondary={600} marginBottom={3} variant='h5'>
          Control Panel
        </Typography>
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
