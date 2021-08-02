import React, { Children, cloneElement, useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { StoreProvider } from 'easy-peasy'
import { makeStyles } from '@material-ui/core/styles'
import { useStoreState, useStoreActions, useStoreDispatch } from 'easy-peasy'
import { Typography } from '@eqworks/lumen-ui'
import { Button } from '@eqworks/lumen-ui'

import WidgetControls from './widget-controls'
import ResultsTable from './components/table'
import styles from './styles'

import { store } from './store'

// provide studio+widget with DnD and easy-peasy store
const withWrappers = studio => {
  return (
    <DndProvider backend={HTML5Backend}>
      <StoreProvider store={store}>
        {studio}
      </StoreProvider>
    </DndProvider>
  )
}

// render child and pass the config object
const WidgetWithConfig = ({ widget, config }) => cloneElement(widget, { config })

// put styles in separate file for readability
const useStyles = makeStyles((theme) => styles(theme))

const WidgetStudio = ({ children, columns, rows, loading: resultsLoading, dataSource, dataID }) => {

  const classes = useStyles()
  const isDone = useStoreState((state) => state.isDone)
  const type = useStoreState((state) => state.initState.type)
  const config = useStoreState((state) => state.config)
  const [showControls, setShowControls] = useState(true)
  const [showTable, setShowTable] = useState(false)

  // for remaining easy-peasy store functionality
  const dispatch = useStoreDispatch()
  const widgetsReset = useStoreActions(actions => actions.reset)

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
        <>
          <div className={classes.outerContainer}>
            <div style={{ overflow: 'auto', display: showTable ? 'flex' : 'none' }}>
              <div className={classes.table}>
                <ResultsTable
                  results={rows} />
              </div>
            </div>
            <div style={{ display: showTable ? 'none' : 'block', height: '90%' }}>
              <div className={classes.container}>
                <div className={classes.chart}>
                  {
                    isDone ?
                      <WidgetWithConfig
                        widget={Children.only(children)}
                        config={config}
                      />
                      :
                      <div className={classes.warning}>
                        <Typography color="textSecondary" variant='h6'>
                          {type ? 'Select data and options.' : 'Select a widget type.'}
                        </Typography>
                      </div>
                  }
                </div>
                <div className={classes.control}>
                  <div style={{ display: showControls ? 'flex' : 'none' }}>
                    <WidgetControls {...{ columns }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.buttonsContainer}>
            <Button
              disabled={!isDone}
              onClick={() => setShowTable(!showTable)}
              type={showTable ? 'secondary' : 'primary'}
            >
              {showTable ? 'Widget' : 'Data'}
            </Button>
            {!showTable &&
              <Button
                disabled={!isDone}
                onClick={() => setShowControls(!showControls)}
                type={showControls ? 'secondary' : 'primary'}
              >
                {showControls ? 'Hide controls' : 'Show controls'}
              </Button>
            }
          </div>
        </>
      }
    </div >
  )
}

WidgetStudio.propTypes = {
  children: PropTypes.object,
  rows: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  dataSource: PropTypes.string,
  dataID: PropTypes.string,
}

export default (props) => {
  return withWrappers(
    <WidgetStudio {...props}>
      {props.children}
    </WidgetStudio>
  )
}


