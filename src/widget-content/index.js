import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-ui'
import { Typography } from '@eqworks/lumen-ui'

import { useStoreState } from '../store'
import adapters from '../adapter-associations'
import styles from '../styles'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetContent = () => {

  const classes = useStyles()

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
  return (
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
  )
}

WidgetContent.propTypes = {

}

export default WidgetContent
