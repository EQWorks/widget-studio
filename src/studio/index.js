import React, { Children, cloneElement, useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { StoreProvider } from 'easy-peasy'
import { makeStyles } from '@material-ui/core/styles'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Typography } from '@eqworks/lumen-ui'
import { Button } from '@eqworks/lumen-ui'

import WidgetControls from './widget-controls'
import ResultsTable from './components/table'
import styles from './styles'

import { requestData, requestConfig } from '../util/fetch'
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

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetStudio = ({ dataSource, dataID, children }) => {

  const widget = Children.only(children)

  const classes = useStyles()

  const readConfig = useStoreActions(actions => actions.readConfig)
  const updateStore = useStoreActions(actions => actions.update)
  const widgetsReset = useStoreActions(actions => actions.reset)

  const isDone = useStoreState((state) => state.isDone)
  const config = useStoreState((state) => state.config)
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)

  const [showControls, setShowControls] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const [loading, setLoading] = useState(false)

  const [configControlled, setConfigControlled] = useState(!widget.props.id)

  // send dataSource and dataID to config object on change
  useEffect(() => {
    widgetsReset()
    updateStore({ dataSource, dataID })
  }, [dataSource, dataID, updateStore, widgetsReset])

  // fetch rows/columns on data source change
  useEffect(() => {
    setLoading(true)
    requestData(config.dataSource, config.dataID)
      .then(({ rows, columns }) => {
        updateStore({ rows, columns })
        setLoading(false)
      })
  }, [config.dataSource, config.dataID, updateStore])

  // gain control of the config object if the widget has one
  if (!configControlled) {
    requestConfig(widget.props.id).then(obj => {
      readConfig(obj)
      setConfigControlled(true)
    })
  }

  // useEffect(() => {
  //   console.log("**************************");
  //   console.dir(config)
  // }, [config]);

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
                      cloneElement(
                        widget,
                        {
                          studioConfig: config,
                          studioData: { rows, columns }
                        }
                      )
                      :
                      <div className={classes.warning}>
                        <Typography color="textSecondary" variant='h6'>
                          {
                            !config.dataSource || !config.dataID ? 'No data'
                              :
                              loading ? 'Loading data...'
                                :
                                !rows.length ? 'Data is empty.'
                                  :
                                  config.type ? 'Select data and options.'
                                    : 'Select a widget type.'

                          }
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


