import React from 'react'
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
    widgetsDispatch,
    widgetsState: {
      type,
      xAxis,
      yAxis,
      isOpen,
    },
    isDone,
    resultLoading,
    resultState: {
      results,
      columns
    },
    savedQueriesStates: {
      selectedQuery: { saved = -1, execution = -1 },
      // savedQueries,
      // queryExecutions,
    },
  } = mlModel

  // useEffect(() => {
  //   if (results.length && !isDone) {
  //     // if () {
  //     widgetsDispatch({ type: 'WIDGETS', payload: { isOpen: true } })
  //     // }
  //   }
  // }, [widgetsDispatch, isDone, results])



  const classes = useStyles({ isDone })

  const renderWarning = (message) => (
    <div className={classes.warning}>
      <Typography secondary={600} variant='subtitle1'>
        {message}
      </Typography>
    </div>)

  /**PUTBACK */
  // if (saved === -1 && execution === -1) {
  //   return renderWarning('Run or select a query from the list.')
  // }
  /**PUTBACK */


  // if (savedQueries[saved].executions.length === 0 ) { // there is a selected query but no executions
  //   return renderWarning('This query has never been run, try running it first or select a different query from the list')
  // }

  if (results.length === 0 && !resultLoading  ) {
    return renderWarning('No Results')
  }

  return (
    <>
      <Loader backdrop action='circular' open={results.length === 0 && resultLoading} />
      <div className={classes.content}>
        <WidgetSelector
          {...{ xAxis, yAxis, type, columns, isOpen }}
        />
        <div className={classes.placeholder}>
          <Button onClick={() => widgetsDispatch({ type: 'WIDGETS', payload: { isOpen: true } })}> + Chart</Button>
        </div>
        { isDone &&
          <EditMode
            {...{ xAxis, yAxis, type, columns, results }}
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
