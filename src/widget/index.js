import React, { useState, useEffect, createElement } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-ui'
import { Typography } from '@eqworks/lumen-ui'

import { requestData, requestConfig } from '../util/fetch'
import styles from './styles'
import adapters from './adapter-associations'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const Widget = ({ id, studioConfig, studioData }) => {

  const classes = useStyles()

  // define config object to be passed to the WidgetAdapter
  const [config, setConfig] = useState({ dataSource: null, dataID: null })
  useEffect(() => {
    if (studioConfig) {
      // accept controlled config from WidgetStudio if it exists,
      setConfig(studioConfig)
    } else if (id) {
      // otherwise fetch based on ID,
      requestConfig(id).then(obj => setConfig(obj))
    } else {
      // otherwise this component is being used incorrectly 
      throw new Error('Widget components must be wrapped in a WidgetStudio component and/or receive an \'id\' prop.')
    }
  }, [id, studioConfig])

  // define data and handle subsequent data source changes
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  useEffect(() => {
    if (studioData) {
      // accept new data from WidgetStudio if it exists,
      setRows(studioData.rows)
      setColumns(studioData.columns)
    } else {
      // otherwise fetch based on source type + source ID
      requestData(config.dataSource, config.dataID)
        .then(({ results: rows, columns }) => {
          setRows(rows)
          setColumns(columns)
        })
    }
  }, [config.dataSource, config.dataID, studioData])

  return (
    columns && rows && columns.length && rows.length ?
      <>
        <div className={classes.widgetTitle}>
          <Typography color='textSecondary' variant='subtitle1'>
            {config.title}
          </Typography>
        </div>
        {
          // pass data + config to the adapter of choice
          createElement(
            adapters[config.type],
            {
              ...{ rows, columns, config }
            }
          )
        }
      </>
      :
      // display loader
      <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Loader open />
      </div>
  )
}

Widget.propTypes = {
  studioConfig: PropTypes.object,
  studioData: PropTypes.object,
  id: PropTypes.string,
}

export default Widget
