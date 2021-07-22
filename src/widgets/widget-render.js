
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Plot from 'react-plotly.js'
import Paper from '@material-ui/core/Paper'
import { Typography, Button } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'
import { ErrorBoundary } from './helper'
import { getChart } from './components/charts'
import ResultsTable from './components/table'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    overflow:'auto'
  },
  chart: {
    maxHeight: '100%',
    // minHeight: 500,
    // margin: '0 16px 16px 0',
    width: '75%',
    padding: theme.spacing()
  },
  get hiddenChart() {
    return {
      ...this.chart,
      display: 'none'
    }
  },
  control: { width: '25%', padding: 16 },
  get hiddenControl() {
    return {
      ...this.control,
      display: 'none'
    }
  },
  controlHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  showTableButton: {
    width:'10%'
  }
}))

const WidgetRender = ({ rows, columns }) => {
  const classes = useStyles()
  const [revision, setRevision] = useState(0) // if chart needs to be resized
  const type = useStoreState((state) => state.widgets.initState.type)
  const ready = useStoreState((state) => state.widgets.controllers.ready)
  const { props, getControl } = getChart(type)({ columns, rows })
  const [showTable, setShowTable] = useState(false);

  return (
    <div className={classes.container}>
      <Button
        onClick={() => setShowTable(!showTable)}
        className={classes.showTableButton}
        type={ showTable? 'secondary' : 'primary'}
      >
        {
          showTable ?
            'View widget'
            :
            'View raw data'
        }
      </Button>
      {
        <div className={classes.container}>
          <ResultsTable
            hide={!showTable}
            results={rows}
          />
          <Paper
            className={
              showTable ?
                classes.hiddenChart
                :
                classes.chart
            }
          >
            {ready &&
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
          <Paper
            className={
              showTable ?
                classes.hiddenControl
                :
                classes.control
            }
          >
            <div className={classes.controlHeader}>
              <Typography secondary={600} marginBottom={3} variant='h5'>
                Control Panel
              </Typography>
            </div>
            {/* TODO Add title option in control and pass current state to getControl() */}
            {getControl()}
          </Paper>
        </div>
      }
    </div >
  )
}

WidgetRender.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
}
WidgetRender.default = {
  columns: [],
  rows: [],
}

export default WidgetRender
