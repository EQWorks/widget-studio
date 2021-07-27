import React, { Children, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { useStoreState, useStoreActions, useStoreDispatch } from 'easy-peasy'
import { Typography } from '@eqworks/lumen-ui'
import { Button } from '@eqworks/lumen-ui'
import WidgetControls from './widget-controls'
import WidgetSelector from './widget-selector'
import ResultsTable from './components/table'
import styles from './styles'

const useStyles = makeStyles((theme) => styles(theme))

const WidgetConfig = props => {

  const config = useStoreState((state) => state.widgets.config)

  var widget = Children.only(props.children)

  const { columns, rows, loading: resultsLoading } = props
  const dispatch = useStoreDispatch()
  const widgetsReset = useStoreActions(actions => actions.widgets.reset)
  useEffect(() => {
    widgetsReset()
  }, [columns, rows, widgetsReset])

  const isDone = useStoreState((state) => state.widgets.isDone)

  const classes = useStyles({ isDone })

  const [showExtras, setShowExtras] = useState(false)

  const renderWarning = (message) => (
    <div className={classes.warning}>
      <Typography secondary={600} variant='subtitle1'>
        {message}
      </Typography>
    </div>)

  // if (saved === -1 && execution === -1) {
  //   return renderWarning('Run or select a query from the list.')
  // }
  useEffect(() => {
    dispatch({ type: 'DATA', payload: { rows, columns } })
  }, [rows, columns, dispatch])

  if (rows.length === 0 && !resultsLoading) {
    return renderWarning('No Results')
  }
  return (
    <div className={classes.content}>
      {
        isDone ?
          <div className={classes.container}>
            <Button
              onClick={() => setShowExtras(!showExtras)}
              className={classes.showExtrasButton}
              type={showExtras ? 'secondary' : 'primary'}
            >
              {
                showExtras ?
                  'Hide controls'
                  :
                  'Show controls'
              }
            </Button>
            {/* <ResultsTable
              hide={false}
              results={rows}
            /> */}
            <div className={classes.chart}>
              {React.cloneElement(widget, { config })}
            </div>
            <div className={showExtras ? classes.control : classes.hiddenControl}>
              <WidgetControls
                {...{ rows, columns }}
              />
            </div>
          </div>
          :
          <WidgetSelector {...{ columns }} />
      }
    </div>
  )
}

WidgetConfig.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  children: PropTypes.object,
}

export default WidgetConfig
