import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import styles from './styles'
import { useStoreState, useStoreActions } from './store'
import { requestData, requestConfig } from './util/fetch'
import withQueryClient from './util/with-query-client'
import withStore from './util/with-store'
import WidgetStudio from './widget-studio'
import WidgetContent from './widget-content'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

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
  const config = useStoreState((state) => state.config)

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
            dataError: null
          })
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
      {studio && <WidgetStudio />}
      <WidgetContent />
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

export default withQueryClient(withStore(Widget))
