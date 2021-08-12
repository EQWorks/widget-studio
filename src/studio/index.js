import React, { Children, cloneElement, useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { createStore, StoreProvider } from 'easy-peasy'
import { makeStyles } from '@material-ui/core/styles'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { Typography } from '@eqworks/lumen-ui'
import TocIcon from '@material-ui/icons/Toc'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import SettingsIcon from '@material-ui/icons/Settings'
import BuildIcon from '@material-ui/icons/Build'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

import WidgetControls from './widget-controls'
import ResultsTable from './table'
import styles from './styles'

import { requestData, requestConfig } from '../util/fetch'
import { storeContent, storeOptions } from './store'
import DataController from './data-controls'

// provide studio+widget with DnD and easy-peasy store
const withWrappers = studio => {
  return (
    <DndProvider backend={HTML5Backend}>
      <StoreProvider store={createStore(storeContent, storeOptions)}>
        {studio}
      </StoreProvider>
    </DndProvider>
  )
}

// put styles in separate file for readability
const useStyles = makeStyles(styles)

// const WidgetStudio = ({ dataSource, dataID, children }) => {
const WidgetStudio = ({ children }) => {

  // <Widget/> child
  const widget = Children.only(children)
  const widgetID = widget.props.id || null

  const classes = useStyles()

  // easy-peasy actions
  const readConfig = useStoreActions(actions => actions.readConfig)
  const updateStore = useStoreActions(actions => actions.update)
  const reset = useStoreActions(actions => actions.reset)

  // widget configuration state (easy-peasy)
  const dataSource = useStoreState((state) => state.data.source)
  const dataID = useStoreState((state) => state.data.id)
  const isDone = useStoreState((state) => state.isDone)
  const config = useStoreState((state) => state.config)
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)

  // studio UI state
  const [showWidgetControls, setShowWidgetControls] = useState(Boolean(widgetID))
  const [showTable, setShowTable] = useState(false)
  const [showDataControls, setShowDataControls] = useState(false)

  // data retrieval state
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState(null)
  const [initComplete, setInitComplete] = useState(!widgetID)

  // gain control of the config object
  if (!initComplete) {
    requestConfig(widgetID).then(obj => {
      readConfig(obj)
      setInitComplete(true)
    })
  }


  // fetch rows/columns on data source change
  useEffect(() => {
    if (dataSource && dataID) {
      reset()
      setDataLoading(true)
      requestData(dataSource, dataID)
        .then(res => {
          const { results: rows, columns, whitelabelID, customerID } = res
          updateStore({
            rows,
            columns,
            wl: whitelabelID,
            cu: customerID,
          })
          setDataError(null)
          setDataLoading(false)
          setShowWidgetControls(true)
        })
        .catch((err) => {
          setDataError(err)
        })
    }
  }, [dataSource, dataID, updateStore, reset])

  return (
    <div className={classes.content}>
      <div className={classes.outerContainer}>
        <div className={classes.buttonsContainer}>
          {
            showDataControls || showTable ?
              <IconButton
                className={classes.tallButton}
                onClick={() => {
                  setShowTable(false)
                  setShowDataControls(false)
                }}
                color='secondary'
              >
                <HighlightOffIcon />
              </IconButton>
              :
              <>
                <IconButton
                  disabled={!config.dataSource || !config.dataID}
                  onClick={() => setShowDataControls(!showDataControls)}
                  color='secondary'
                >
                  <SettingsIcon />
                </IconButton>
                <IconButton
                  disabled={dataLoading || !config.dataSource || !config.dataID}
                  onClick={() => setShowTable(!showTable)}
                  color='secondary'
                >
                  <TocIcon />
                </IconButton>
              </>
          }
        </div>
        <div className={showDataControls ? classes.alternateView : classes.hiddenAlternateView}>
          <DataController />
        </div>
        <div style={{ overflow: 'auto', display: showTable ? 'flex' : 'none' }}>
          <div className={classes.table}>
            <ResultsTable
              results={rows} />
          </div>
        </div>
        <div className={showDataControls || showTable ? classes.hiddenContainer : classes.container}>
          <div className={classes.chart}>
            {
              !dataLoading && !dataError && isDone ?
                cloneElement(
                  widget,
                  {
                    studioConfig: config,
                    studioData: { rows, columns }
                  }
                )
                :
                <div className={classes.warning}>
                  {
                    !config.dataSource || !config.dataID ?
                      <DataController />
                      :
                      <Typography color="textSecondary" variant='h6'>
                        {
                          dataError ? 'Something went wrong.'
                            :
                            dataLoading ? 'Loading data...'
                              :
                              !rows.length ? 'Sorry, this data is empty.'
                                :
                                config.type ? 'Select columns and configure your widget.'
                                  : 'Select a widget type.'

                        }
                      </Typography>
                  }
                  {
                    config.dataSource && config.dataID &&
                    <Typography color="textSecondary" variant='subtitle2'>
                      {
                        dataError ?
                          `${dataError}`
                          :
                          dataLoading ?
                            `${config.dataSource} ${config.dataID}`
                            :
                            'Data loaded successfully'
                      }
                    </Typography>
                  }
                </div>
            }
          </div>
          <div className={classes.control}>
            <div className={classes.controlTab}>
              <IconButton
                className={classes.tallButton}
                onClick={() => setShowWidgetControls(!showWidgetControls)}
                type={showWidgetControls ? 'secondary' : 'primary'}
              >
                {
                  showWidgetControls ?
                    <KeyboardArrowRightIcon />
                    :
                    <BuildIcon />
                }
              </IconButton>
            </div>
            <div style={{ display: showWidgetControls ? 'flex' : 'none' }}>
              <WidgetControls {...{ columns, dataLoading }} />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

WidgetStudio.propTypes = {
  children: PropTypes.object,
}

export default (props) => {
  return withWrappers(
    <WidgetStudio {...props}>
      {props.children}
    </WidgetStudio>
  )
}


