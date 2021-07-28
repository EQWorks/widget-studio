import React, { cloneElement, Children, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import { useStoreState, useStoreActions, useStoreDispatch } from 'easy-peasy'
import { Typography } from '@eqworks/lumen-ui'
import { Button } from '@eqworks/lumen-ui'

import WidgetControls from './widget-controls'
import WidgetSelector from './widget-selector'
import ResultsTable from './components/table'
import styles from './styles'

// render child and pass the config object
const WidgetWithConfig = ({ widget, config }) => cloneElement(widget, { config })

// put styles in separate file for readability
const useStyles = makeStyles((theme) => styles(theme))

const WidgetConfig = ({ children, columns, rows, loading: resultsLoading, dataSource, dataID }) => {

  const classes = useStyles()
  const isDone = useStoreState((state) => state.widgets.isDone)
  const config = useStoreState((state) => state.widgets.config)
  const [showControls, setShowControls] = useState(false)
  const [showTable, setShowTable] = useState(false)

  // for remaining easy-peasy store functionality
  const dispatch = useStoreDispatch()
  const widgetsReset = useStoreActions(actions => actions.widgets.reset)

  // reset when data changes
  useEffect(() => {
    widgetsReset()
  }, [columns, rows, widgetsReset])

  // send dataSource and dataID to config object on change
  useEffect(() => {
    dispatch({ type: 'CONTROLLER', payload: { dataSource, dataID } })
  }, [dataSource, dataID, dispatch])

  if (rows.length === 0 && !resultsLoading) {
    return (
      <div className={classes.warning}>
        <Typography secondary={600} variant='subtitle1'> No results </Typography>
      </div>
    )
  }
  return (
    <div className={classes.content}>
      {
        !isDone ?
          <WidgetSelector {...{ columns }} />
          :
          <div className={classes.outerContainer}>
            <div className={classes.container}>
              <div className={classes.chart}>
                <WidgetWithConfig
                  widget={Children.only(children)}
                  config={config}
                />
              </div>
              <div className={showControls ? classes.control : classes.hiddenControl}>
                <WidgetControls
                  {...{ rows, columns }}
                />
              </div>
            </div>
            <div className={classes.buttonsContainer}>
              <Button onClick={() => setShowTable(!showTable)}> View table </Button>
              <Button
                onClick={() => setShowControls(!showControls)}
                type={showControls ? 'secondary' : 'primary'}
              >
                {showControls ? 'Hide controls' : 'Show controls'}
              </Button>
            </div>
          </div>
      }
      <Modal
        className={classes.modal}
        open={showTable}
      >
        <div className={classes.table}>
          <Button style={{ float: 'right' }} onClick={() => setShowTable(false)}>CLOSE</Button>
          <ResultsTable
            results={rows}
          />
        </div>
      </Modal>
    </div >
  )
}

WidgetConfig.propTypes = {
  children: PropTypes.object,
  rows: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  dataSource: PropTypes.string,
  dataID: PropTypes.string,
}

export default WidgetConfig
