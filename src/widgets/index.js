import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { useStoreDispatch, useStoreState, useStoreActions } from 'easy-peasy'
import { Button, Loader, Typography } from '@eqworks/lumen-ui'
import ResultsTable from '../components/ql-components/table'
import WidgetSelector from './modal'
import EditMode from './edit-mode'

const useStyles = makeStyles((theme) => ({
  warning: { textAlign: 'center', marginTop: theme.spacing(6) },
  placeholder: { minHeight: ({ isDone }) => isDone ? '100%' : 500 },
  content: {
    overflow: 'auto',
    padding: 18,
    maxHeight: 'calc(100vh - 150px)'
  }
}))

const WidgetStudio = ({ results }) => {

  const { columns, rows, loading: resultsLoading } = results
  const widgetsReset = useStoreActions(actions => actions.widgets.reset)
  useEffect(() => {
    widgetsReset()
  }, [columns, rows, widgetsReset])

  const isDone = useStoreState((state) => state.widgets.isDone)
  const dispatch = useStoreDispatch()

  const classes = useStyles({ isDone })

  const renderWarning = (message) => (
    <div className={classes.warning}>
      <Typography secondary={600} variant='subtitle1'>
        {message}
      </Typography>
    </div>)

  // if (saved === -1 && execution === -1) {
  //   return renderWarning('Run or select a query from the list.')
  // }

  if (rows.length === 0 && !resultsLoading) {
    return renderWarning('No Results')
  }
  // dispatch({ type: 'WIDGETS', payload: { isOpen: true } })
  // const loaderIsOpen = results.length === 0 && resultsLoading
  return (
    <>
      {/* <Loader backdrop action='circular' open={loaderIsOpen} /> */}
      <div className={classes.content}>
        <WidgetSelector
          // {...{ columns, loaderIsOpen }}
          {...{ columns, loaderIsOpen: false }}
        />
        <div className={classes.placeholder}>
          {/* <Button onClick={() => dispatch({ type: 'WIDGETS', payload: { isOpen: true } })}> + Chart</Button> */}
        </div>
        { isDone &&
          <EditMode
            {...{ columns, rows }}
          />
        }
        <ResultsTable {...{ results: rows }}/>
      </div>
    </>
  )
}

WidgetStudio.propTypes = {
  results: PropTypes.object,
}

export default WidgetStudio
