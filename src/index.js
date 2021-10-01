import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import styles from './styles'
import { useStoreState, useStoreActions } from './store'
import { requestData, requestConfig } from './util/fetch'
import withQueryClient from './util/with-query-client'
import withStore from './util/with-store'
import WidgetEditor from './editor'
import WidgetContent from './content'
import WidgetView from './view'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const Widget = ({ id, editor, staticData }) => {

  const classes = useStyles()

  // easy-peasy actions
  const readConfig = useStoreActions(actions => actions.readConfig)
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)
  const reset = useStoreActions(actions => actions.reset)

  // widget configuration state (easy-peasy)
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const config = useStoreState((state) => state.config)

  // on first load,
  useEffect(() => {
    // dispatch staticData prop
    nestedUpdate({ editorUI: { staticData } })
    // check for invalid component usage
    if (id == undefined || id == null) {
      if (staticData || !editor) {
        throw new Error('Incorrect usage: Widgets must either receive an id or have editor features and data control enabled.')
      }
    } else {
      // fetch/read the config associated with the widget ID
      requestConfig(id).then(readConfig)
    }
  }, [readConfig, id, staticData, editor, nestedUpdate])

  // fetch rows/columns on data source change, reset config appropriately
  useEffect(() => {
    if (dataSourceType && dataSourceID) {
      if (config) {
        reset()
      }
      nestedUpdate({
        editorUI: {
          showDataSourceControls: false
        },
        dataSource: {
          loading: true
        }
      })
      requestData(dataSourceType, dataSourceID)
        .then(res => {
          const { results: rows, columns, whitelabelID, customerID, views } = res
          update({
            rows,
            columns,
            wl: whitelabelID, // only used for wl-cu-selector
            cu: customerID, // only used for wl-cu-selector
          })
          nestedUpdate({
            dataSource: {
              name: views[0].name,
              error: null,
            },
            editorUI: {
              showWidgetControls: true,
              showFilterControls: true
            }
          })
        })
        .catch((error) => {
          nestedUpdate({ dataSource: { error } })
        })
        .finally(() => {
          nestedUpdate({ dataSource: { loading: false } })
        })
    } else {
      nestedUpdate({ editorUI: { showDataSourceControls: !staticData } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceID, dataSourceType, reset, update, nestedUpdate, staticData])

  return (
    <div className={classes.outerContainer}>
      <WidgetView />
      <WidgetContent />
      {editor && <WidgetEditor />}
    </div >
  )
}

Widget.propTypes = {
  editor: PropTypes.bool,
  id: PropTypes.string,
  staticData: PropTypes.bool,
}
Widget.defaultProps = {
  editor: false,
  id: undefined,
  staticData: false,
}

export default withQueryClient(withStore(Widget))
