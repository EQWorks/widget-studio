import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-labs'
import { Typography } from '@eqworks/lumen-ui'

import { useStoreState } from '../store'
import WidgetAdapter from './widget-adapter'
import styles from '../styles'
import ResultsTable from '../table'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetContent = () => {

  const classes = useStyles()

  // widget configuration state (easy-peasy)
  const type = useStoreState((state) => state.type)
  const isReady = useStoreState((state) => state.isReady)
  const rows = useStoreState((state) => state.rows)

  // UI state
  const showTable = useStoreState((state) => state.editorUI.showTable)
  const showDataSourceControls = useStoreState((state) => state.editorUI.showDataSourceControls)
  const dataSourceLoading = useStoreState((state) => state.editorUI.dataSourceLoading)
  const dataSourceError = useStoreState((state) => state.editorUI.dataSourceError)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)

  // descriptive message to display when the data source is still loading
  const dataSourceLoadingMessage = useMemo(() => (
    dataSourceType && dataSourceID ?
      `Loading ${dataSourceType.charAt(0).toLowerCase() + dataSourceType.slice(1)} ${dataSourceID}`
      :
      'Loading'
  ), [dataSourceType, dataSourceID])

  // descriptive messages to display when the data source is finished loading but the widget cannot yet be rendered
  const widgetWarning = useMemo(() => ({
    primary:
      !dataSourceID || !dataSourceType ? 'Please select a data source.'
        : dataSourceError ? 'Something went wrong.'
          : !rows.length ? 'Sorry, this data is empty.'
            : type ? 'Select columns and configure your widget.'
              : 'Select a widget type.',
    secondary:
      dataSourceError ? `${dataSourceError}`
        : 'Data loaded successfully'
  }), [dataSourceError, dataSourceID, dataSourceType, rows.length, type])

  return (

    <div className={showDataSourceControls ? classes.hidden : classes.mainContainer}>
      <div className={!showTable ? classes.hidden : classes.table}>
        <ResultsTable results={rows} />
      </div>

      <div className={showTable ? classes.hidden : classes.widgetContainer}>
        {
          // config object ready?
          isReady ?
            // render widget
            <WidgetAdapter />
            :
            // guide the user to configure the widget
            <div className={classes.warningContainer}>
              {
                dataSourceLoading ?
                  <div className={classes.loader}>
                    <Loader open classes={{ icon: 'text-primary-700' }} />
                  </div>
                  :
                  <Typography color="textSecondary" variant='h6'>
                    {widgetWarning.primary}
                  </Typography>
              }
              <Typography color="textSecondary" variant='subtitle2'>
                {
                  dataSourceLoading ?
                    dataSourceLoadingMessage
                    :
                    widgetWarning.secondary
                }
              </Typography>
            </div>
        }
      </div>
    </div >
  )
}

export default WidgetContent
