import React, { useEffect, createElement } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-ui'
import { Typography } from '@eqworks/lumen-ui'
import { QueryClient, QueryClientProvider } from 'react-query'
import { StudioStore, useStoreState, useStoreActions } from './studio/store'

import styles from './styles'
import { requestData, requestConfig } from './util/fetch'
import Studio from './studio'
import adapters from './adapter-associations'


// put styles in separate file for readability
const useStyles = makeStyles(styles)

// provide studio+widget with QueryClient
const queryClient = new QueryClient()
const WrappedWidget = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StudioStore.Provider>
        <Widget {...props} />
      </StudioStore.Provider>
    </QueryClientProvider>
  )
}

const Widget = ({ id, studio, dynamicDataSource }) => {

  const classes = useStyles()

  // easy-peasy actions
  const readConfig = useStoreActions(actions => actions.readConfig)
  const updateStore = useStoreActions(actions => actions.update)
  const updateUI = useStoreActions(actions => actions.updateUI)
  const reset = useStoreActions(actions => actions.reset)

  // widget configuration state (easy-peasy)
  const dataSource = useStoreState((state) => state.data.source)
  const dataID = useStoreState((state) => state.data.id)
  const title = useStoreState((state) => state.title)
  const type = useStoreState((state) => state.type)
  const config = useStoreState((state) => state.config)
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)

  // studio UI state
  const showTable = useStoreState((state) => state.ui.showTable)
  const showDataControls = useStoreState((state) => state.ui.showDataControls)

  // data retrieval state
  const dataLoading = useStoreState((state) => state.dataLoading)
  const dataError = useStoreState((state) => state.dataError)

  // on first load, get/read the config associated with the widget ID
  useEffect(() => {
    requestConfig(id).then(readConfig)
  }, [readConfig, id])

  // fetch rows/columns on data source change, reset config appropriately
  useEffect(() => {
    if (dataSource && dataID) {
      if (config) {
        reset()
      }
      updateStore({ dataLoading: true })
      requestData(dataSource, dataID)
        .then(res => {
          const { results: rows, columns, whitelabelID, customerID } = res
          updateStore({
            rows,
            columns,
            wl: whitelabelID, // only used for wl-cu-selector
            cu: customerID, // only used for wl-cu-selector
          })
          updateStore({ dataError: null })
          updateUI({ showWidgetControls: true })
        })
        .catch((err) => {
          updateStore({ dataError: err })
        })
        .finally(() => {
          updateStore({ dataLoading: false })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataID, dataSource, reset, updateUI, updateStore])

  return (
    <div className={classes.outerContainer}>

      {studio && <Studio />}

      <div className={showDataControls || showTable ? classes.hidden : classes.mainContainer}>
        {
          // config object ready?
          config ?
            // render widget
            <div className={classes.widgetContainer}>
              <div className={classes.widgetTitle}>
                <Typography color='textSecondary' variant='subtitle1'>
                  {title}
                </Typography>
              </div>
              {
                // pass data + config to the adapter of choice
                createElement(
                  adapters[type],
                  {
                    ...{ rows, columns, config }
                  }
                )
              }
            </div>
            :
            // guide the user to configure the widget
            <div className={classes.warning}>
              <Typography color="textSecondary" variant='h6'>
                {
                  dataError ? 'Something went wrong.'
                    :
                    dataLoading ?
                      <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>

                        <Loader message="Loading data..." open />
                      </div>
                      :
                      !rows.length ? 'Sorry, this data is empty.'
                        :
                        type ? 'Select columns and configure your widget.'
                          : 'Select a widget type.'

                }
              </Typography>
              <Typography color="textSecondary" variant='subtitle2'>
                {
                  dataError ?
                    `${dataError}`
                    :
                    dataLoading ?
                      `${dataSource} ${dataID}`
                      :
                      'Data loaded successfully'
                }
              </Typography>
            </div>
        }
      </div>
    </div >
  )
}

Widget.propTypes = {
  studio: PropTypes.bool,
  id: PropTypes.string,
  dynamicDataSource: PropTypes.bool,
}
Widget.defaultProps = {
  studio: false,
  id: undefined,
  dynamicDataSource: false,
}

export default WrappedWidget
