import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Resizable } from 're-resizable'

import styles from './styles'
import { useStoreState, useStoreActions } from './store'
import { requestData, requestConfig } from './util/fetch'
import withQueryClient from './util/with-query-client'
import withStore from './util/with-store'
import WidgetStudio from './widget-studio'
import WidgetContent from './widget-content'
import WidgetTitle from './widget-content/widget-title'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const Widget = ({ id, studio, staticData, resizable }) => {

  const classes = useStyles()

  // easy-peasy actions
  const readConfig = useStoreActions(actions => actions.readConfig)
  const updateStore = useStoreActions(actions => actions.update)
  const updateUI = useStoreActions(actions => actions.updateUI)
  const reset = useStoreActions(actions => actions.reset)

  // widget configuration state (easy-peasy)
  const dataSource = useStoreState((state) => state.data.source)
  const dataID = useStoreState((state) => state.data.id)
  const config = useStoreState((state) => state.config)

  useEffect(() => {
    console.dir(config)
  }, [config])

  // on first load,
  useEffect(() => {
    // dispatch staticData prop
    updateUI({ staticData })
    // check for invalid component usage
    if (id == undefined || id == null) {
      if (staticData || !studio) {
        throw new Error('Incorrect usage: Widgets must either receive an id or have studio features and data control enabled.')
      }
    } else {
      // fetch/read the config associated with the widget ID
      requestConfig(id).then(readConfig)
    }
  }, [readConfig, id, staticData, updateUI, studio])

  // fetch rows/columns on data source change, reset config appropriately
  useEffect(() => {
    if (dataSource && dataID) {
      if (config) {
        reset()
      }
      updateStore({ dataLoading: true })
      updateUI({ showDataControls: false })
      requestData(dataSource, dataID)
        .then(res => {
          const { results: rows, columns, whitelabelID, customerID, views } = res
          updateStore({
            rows,
            columns,
            wl: whitelabelID, // only used for wl-cu-selector
            cu: customerID, // only used for wl-cu-selector
            dataError: null,
            dataName: views[0].name,
          })
          updateUI({ showWidgetControls: true })
          updateUI({ showFilterControls: true })
        })
        .catch((err) => {
          updateStore({ dataError: err })
        })
        .finally(() => {
          updateStore({ dataLoading: false })
        })
    } else {
      updateUI({ showDataControls: !staticData })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataID, dataSource, reset, updateUI, updateStore])

  const ws =
    <div className={classes.outerContainer}>
      <WidgetTitle />
      {studio && <WidgetStudio />}
      <WidgetContent />
    </div >

  return (
    resizable ?
      <Resizable>
        <div style={{ display: 'flex', width: '100%', height: '100%' }} >
          {ws}
        </div>
      </Resizable>
      :
      ws
  )
}

Widget.propTypes = {
  studio: PropTypes.bool,
  id: PropTypes.string,
  staticData: PropTypes.bool,
  resizable: PropTypes.bool,
}
Widget.defaultProps = {
  studio: false,
  id: undefined,
  staticData: false,
  resizable: true,
}

export default withQueryClient(withStore(Widget))
