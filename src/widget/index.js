import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { updateData } from './fetch'
import { Loader } from '@eqworks/lumen-ui'

import { WidgetAdapter } from '@eqworks/chart-system'

import { sampleConfigs } from '../../stories/sample-data'
const Widget = ({ id, config: passedConfig }) => {

  // TODO implement fetching config from db
  if (id && !sampleConfigs[id]) {
    throw new Error("not implemented")
  }
  const config = id && sampleConfigs[id] ? sampleConfigs[id] : passedConfig

  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])

  // fetch rows/columns on data source change
  useEffect(() => {
    updateData(config.dataSource, config.dataID)
      .then(({ rows, columns }) => {
        setRows(rows)
        setColumns(columns)
      })
  }, [config.dataSource, config.dataID])

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
  config: PropTypes.object,
  id: PropTypes.number
}

export default Widget
