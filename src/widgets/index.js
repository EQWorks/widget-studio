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

const Widgets = ({ qlModel }) => {
  const {
    builder: {
      resultState: {
        results,
        columns,
        resultLoading,
      },
    },
    queries: {
      selectedQuery: { saved = -1, execution = -1 },
    },
  } = qlModel

  const widgetsReset = useStoreActions(actions => actions.widgets.reset)

  useEffect(() => {
    widgetsReset()
  }, [saved, execution, widgetsReset])

  const isDone = useStoreState((state) => state.widgets.isDone)
  const dispatch = useStoreDispatch()

  const classes = useStyles({ isDone })

  const renderWarning = (message) => (
    <div className={classes.warning}>
      <Typography secondary={600} variant='subtitle1'>
        {message}
      </Typography>
    </div>)

  if (saved === -1 && execution === -1) {
    return renderWarning('Run or select a query from the list.')
  }

  if (results.length === 0 && !resultLoading  ) {
    return renderWarning('No Results')
  }

  const loaderIsOpen = results.length === 0 && resultLoading
  return (
    <>
      <Loader backdrop action='circular' open={loaderIsOpen} />
      <div className={classes.content}>
        <WidgetSelector
          {...{ columns, loaderIsOpen }}
        />
        <div className={classes.placeholder}>
          <Button onClick={() => dispatch({ type: 'WIDGETS', payload: { isOpen: true } })}> + Chart</Button>
        </div>
        { isDone &&
          <EditMode
            {...{ columns, results }}
          />
        }
        <ResultsTable {...{ results }}/>
      </div>
    </>
  )
}

Widgets.propTypes = {
  qlModel: PropTypes.object,
}

export default Widgets
