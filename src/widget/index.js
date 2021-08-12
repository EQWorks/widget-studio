import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { Loader } from '@eqworks/lumen-ui'
import { WidgetAdapter } from '@eqworks/chart-system'

import { requestData, requestConfig } from '../util/fetch'

const Widget = ({ id, studioConfig, studioData }) => {

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
      <WidgetAdapter {...{ rows }} {...{ columns }} {...{ config }} />
      :
      <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Loader open={true} />
      </div>
  )
}

Widget.propTypes = {
  studioConfig: PropTypes.object,
  studioData: PropTypes.object,
  id: PropTypes.string,
}

export default Widget
