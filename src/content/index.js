import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-ui'
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
  const config = useStoreState((state) => state.config)
  const rows = useStoreState((state) => state.rows)

  // UI state
  const showTable = useStoreState((state) => state.editorUI.showTable)

  // data retrieval state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataSourceLoading = useStoreState((state) => state.dataSource.loading)
  const dataSourceError = useStoreState((state) => state.dataSource.error)

  return (
    <div className={classes.mainContainer}>
      <div className={!showTable ? classes.hidden : classes.table}>
        <ResultsTable results={rows} />
      </div>

      <div className={showTable ? classes.hidden : classes.widgetContainer}>
        {
          // config object ready?
          config ?
            // render widget
            <WidgetAdapter />
            :
            // guide the user to configure the widget
            <div className={classes.warning}>
              <Typography color="textSecondary" variant='h6'>
                {
                  !dataSourceID || !dataSourceType ? 'Please select a data source.'
                    :
                    dataSourceError ? 'Something went wrong.'
                      :
                      dataSourceLoading ?
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
                  dataSourceID && dataSourceType &&
                  (
                    dataSourceError ?
                      `${dataSourceError}`
                      :
                      dataSourceLoading ?
                        `${dataSourceType} ${dataSourceID}`
                        :
                        'Data loaded successfully'
                  )
                }
              </Typography>
            </div>
        }
      </div>
    </div>
  )
}

WidgetContent.propTypes = {

}

export default WidgetContent
