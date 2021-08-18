import React, { Children, cloneElement, useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { QueryClient, QueryClientProvider } from 'react-query'
import TocIcon from '@material-ui/icons/Toc'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import SettingsIcon from '@material-ui/icons/Settings'
import BuildIcon from '@material-ui/icons/Build'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { makeStyles } from '@material-ui/core/styles'
import { StudioStore, useStoreState, useStoreActions } from './store'
import { Typography } from '@eqworks/lumen-ui'

import WidgetControls from './widget-controls'
import ResultsTable from './table'
import styles from './styles'
import { requestData, requestConfig } from '../util/fetch'
import DataControls from './data-controls'

// provide studio+widget with QueryClient
const queryClient = new QueryClient()
const WrappedWidgetStudio = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StudioStore.Provider>
        <WidgetStudio>
          {children}
        </WidgetStudio>
      </StudioStore.Provider>
    </QueryClientProvider>
  )
}

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetStudio = props => {

  const classes = useStyles()

  // <Widget /> child
  const widget = Children.only(props.children)
  const widgetID = widget.props.id || null

  // easy-peasy actions
  const readConfig = useStoreActions(actions => actions.readConfig)
  const updateStore = useStoreActions(actions => actions.update)
  const reset = useStoreActions(actions => actions.reset)

  // widget configuration state (easy-peasy)
  const dataSource = useStoreState((state) => state.data.source)
  const dataID = useStoreState((state) => state.data.id)
  const isReady = useStoreState((state) => state.isReady)
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

  // on first load, gain control of the widget's predefined config object (if it has one)
  const [initComplete, setInitComplete] = useState(!widgetID)
  if (!initComplete) {
    requestConfig(widgetID).then(obj => {
      readConfig(obj)
      setInitComplete(true)
    })
  }

  // fetch rows/columns on data source change, reset config appropriately
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
            wl: whitelabelID, // only used for wl-cu-selector
            cu: customerID, // only used for wl-cu-selector
          })
          setDataError(null)
          setShowWidgetControls(true)
        })
        .catch((err) => {
          setDataError(err)
        })
        .finally(() => {
          setDataLoading(false)
        })
    }
  }, [dataSource, dataID, updateStore, reset])

  return (
    <div className={classes.outerContainer}>
      <div className={classes.innerContainer}>

        <div className={classes.navigationSidebar}>
          {
            // something to exit?
            showDataControls || showTable ?
              // show exit button
              <IconButton className={classes.tallButton} color='secondary'
                onClick={() => {
                  setShowTable(false)
                  setShowDataControls(false)
                }} > <HighlightOffIcon /> </IconButton>
              :
              // show sidebar buttons
              <>
                <IconButton disabled={!config.dataSource || !config.dataID} color='secondary'
                  onClick={() => setShowDataControls(!showDataControls)}
                > <SettingsIcon /> </IconButton>
                <IconButton disabled={dataLoading || !config.dataSource || !config.dataID} color='secondary'
                  onClick={() => setShowTable(!showTable)} > <TocIcon /> </IconButton>
              </>
          }
        </div>

        <div className={showDataControls || showTable ? classes.hidden : classes.mainContainer}>
          <div className={classes.widgetContainer}>
            {
              // widget is ready?
              !dataLoading && !dataError && isReady ?
                // render widget
                cloneElement(
                  widget,
                  {
                    studioConfig: config,
                    studioData: { rows, columns }
                  }
                )
                :
                // show relevant warnings 
                <div className={classes.warning}>
                  {
                    // no data selected?
                    !config.dataSource || !config.dataID ?
                      // show data controls
                      <DataControls />
                      :
                      // guide the user to configure the widget
                      <>
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
                      </>
                  }
                </div>
            }
          </div>

          <div className={classes.widgetControlsSidebar}>
            <div className={classes.widgetControlsSidebarTab}>
              <IconButton className={classes.tallButton}
                onClick={() => setShowWidgetControls(!showWidgetControls)} >
                {showWidgetControls ? <KeyboardArrowRightIcon /> : <BuildIcon />}
              </IconButton>
            </div>
            <div className={showWidgetControls ? classes.flex : classes.hidden} >
              <WidgetControls {...{ columns, dataLoading }} />
            </div>
          </div>

        </div>

        <div className={classes.extras}>
          <div className={showDataControls ? classes.dataControlsAlt : classes.hidden}>
            <DataControls />
          </div>
          <div className={showTable ? null : classes.hidden}>
            <ResultsTable results={rows} />
          </div>
        </div>

      </div>
    </div >
  )
}

WidgetStudio.propTypes = {
  children: PropTypes.object,
}

export default WrappedWidgetStudio

