import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import ResultsTable from '../components/table'
import WidgetSelector from './modal'
import EditMode from './edit-mode'
import { Button, Loader, Typography } from '@eqworks/lumen-ui'

const useStyles = makeStyles((theme) => ({
  warning: { textAlign: 'center', marginTop: theme.spacing(6) },
  placeholder: { minHeight: ({ isDone }) => isDone ? '100%' : 500 },
  content: {
    overflow: 'auto',
    padding: 18,
    maxHeight: 'calc(100vh - 100px)'
  }
}))

const Widgets = ({ mlModel }) => {
  const {
    // resultLoading,
    resultState: {
      results,
      columns
    },
    savedQueriesStates: {
      selectedQuery: { saved },
      savedQueries
    },
  } = mlModel
  const [type, setType] = useState('')
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setXAxis('')
    setYAxis('')
    setType('')
    if (results.length) {
      setIsOpen(true)
    }
  }, [results])

  // useEffect(() => {
  //   return () => {
  //     confirm('you are going to lose these changes')
  //   }
  // }, [])

  const isDone = Boolean(xAxis && yAxis && type && !isOpen)

  const classes = useStyles({ isDone })

  const renderWarning = (message) => (
    <div className={classes.warning}>
      <Typography secondary={600} variant='subtitle1'>
        {message}
      </Typography>
    </div>)

  if (saved < 0) {
    return renderWarning('Run or select a query from the list.')
  }
  if (!savedQueries[saved].executions.length) { // there is a selected query but no executions
    return renderWarning('This query has never been run, try running it first or select a different query from the list')
  }

  // if (results.length === 0 && !resultLoading  ) {
  //   return renderWarning('The results for this query are empty')
  // }
  return (
    <>
      <Loader backdrop action='circular' open={results.length === 0} />
      <div className={classes.content}>
        <WidgetSelector
          {...{ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, isOpen, setIsOpen }}
        />
        <div className={classes.placeholder}>
          <Button onClick={() => setIsOpen(true)}> + Chart</Button>
        </div>
        { isDone &&
      <EditMode
        {...{ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, results }}
      />
        }
        <ResultsTable {...{ results }}/>
      </div>
    </>
  )
}

Widgets.propTypes = {
  mlModel: PropTypes.object,
}

export default Widgets
