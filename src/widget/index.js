import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { requestData, requestConfig } from '../util/fetch'
import { Loader } from '@eqworks/lumen-ui'
import { WidgetAdapter } from '@eqworks/chart-system'

const Widget = ({ id, studioConfig, studioData }) => {

  const [config, setConfig] = useState({ dataSource: null, dataID: null })

  useEffect(() => {
    if (studioConfig) {
      setConfig(studioConfig)
    } else if (id) {
      requestConfig(id).then(obj => setConfig(obj))
    } else {
      throw new Error('Widget components must be wrapped in a WidgetStudio component and/or receive an \'id\' prop.')
    }
  }, [id, studioConfig])

  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])

  // handle data source change
  useEffect(() => {
    if (studioData) {
      setRows(studioData.rows)
      setColumns(studioData.columns)
    } else {
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
