import React, { useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'
import { Loader, Layout } from '@eqworks/lumen-labs'

import ResultsTable from './table'
import modes from '../constants/modes'
import { useStoreState } from '../store'
import styles from '../styles'
import WidgetAdapter from './adapter'
import WidgetTitleBar from './title-bar'


const useStyles = makeStyles(styles)

const WidgetView = () => {

  const classes = useStyles()

  // widget state
  const type = useStoreState((state) => state.type)
  const rows = useStoreState((state) => state.rows)
  const isReady = useStoreState((state) => state.isReady)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const showTable = useStoreState((state) => state.ui.showTable)
  const showDataSourceControls = useStoreState((state) => state.ui.showDataSourceControls)
  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)
  const dataSourceError = useStoreState((state) => state.ui.dataSourceError)

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
        : 'Data loaded successfully',
  }), [dataSourceError, dataSourceID, dataSourceType, rows.length, type])


  return (
    <>
      <Layout className='w-full flex row-span-1 col-span-2 shadow'>
        <WidgetTitleBar />
      </Layout>

      <div className={showDataSourceControls ? classes.hidden : classes.mainContainer}>
        <div className={!showTable
          ? classes.hidden
          : mode !== modes.VIEW
            ? classes.table
            : ''
        }>
          <ResultsTable results={rows} />
        </div>
        <div className={showTable ? classes.hidden : classes.widgetContainer}>
          {

            // config object ready?
            dataReady && isReady ?
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
      </div>
    </>
  )
}

export default WidgetView
