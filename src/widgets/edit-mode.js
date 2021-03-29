import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Plot from 'react-plotly.js'
import Paper from '@material-ui/core/Paper'
import { Typography, Button } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'
import { ErrorBoundary } from './helper'
import { getChart } from './components/charts'


const useStyles = makeStyles((theme) => ({
  content: { display: 'flex', marginTop: 10 },
  chart: {
    minHeight: 500,
    margin: '0 16px 16px 0',
    width: '75%',
    padding: theme.spacing()
  },
  control: { width: '25%', marginBottom: 16, padding: 16 },
}))

const EditMode = ({ results, columns }) => {
  const classes = useStyles()
  const [revision, setRevision] = useState(0) // if chart needs to be resized
  const type = useStoreState((state) => state.widgets.initState.type)
  const { props, getControl, ready } = getChart(type)({ columns, results })

  return (
    <div className={classes.content}>
      <Paper className={classes.chart}>
        {(ready) &&
          <ErrorBoundary>
            <Plot
              style={{ width: '100%', height: '90%' }}
              revision={revision} // if chart needs to be resized
              {...props}
            />
            <Button
              onClick={() => setRevision(revision + 1)}
              type='tertiary'>
              Resize
            </Button>
          </ErrorBoundary>
        }
      </Paper>
      <Paper className={classes.control}>
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
}
EditMode.default = {
  columns: [],
  results: [],
}

export default EditMode
