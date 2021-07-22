import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Typography } from '@eqworks/lumen-ui'
import EditMode from './edit-mode'

const useStyles = makeStyles((theme) => ({
  warning: { textAlign: 'center', marginTop: theme.spacing(6) },
}))

const WidgetStudio = ({ results }) => {

  const { columns, rows, loading: resultsLoading } = results
  const widgetsReset = useStoreActions(actions => actions.widgets.reset)
  useEffect(() => {
    widgetsReset()
  }, [columns, rows, widgetsReset])

  const isDone = useStoreState((state) => state.widgets.isDone)

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
  return (
    <div className={classes.content}>
      <EditMode
        {...{ columns, rows }}
      />
    </div>
  )
}

WidgetStudio.propTypes = {
  results: PropTypes.object,
}

export default WidgetStudio
