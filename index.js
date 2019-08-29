import React, { useEffect, useState } from 'react'

import SplitPane from 'react-split-pane'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import CircularProgress from '@material-ui/core/CircularProgress'
import MUIDataTable from 'mui-datatables'
import { cloneDeep } from 'lodash'

import getAxios from '../../helpers/axios/api'
import { withDragDropContext } from './dnd'
import { useMLViews, useMLModel } from './hooks'
import Views from './views'
import Query from './query'


const propTypes = {
  views: PropTypes.array.isRequired,
  viewsloading: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  geoJoin: PropTypes.bool.isRequired,
  onQuerySubmit: PropTypes.func.isRequired,
}

function ML({ onQuerySubmit, views: existingViews, viewsloading, preview, geoJoin }) {
  let [views, loading] = useMLViews(viewsloading)
  if (viewsloading !== undefined) {
    views = existingViews
    loading = viewsloading
  }

  const mlModel = useMLModel(geoJoin)
  // eslint-disable-next-line
  const [data, setData] = useState()
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    window.document.title = 'Locus ML'
  }, [])

  // eslint-disable-next-line
  const runQuery = (model, isPreview) => {
    if (!isPreview && onQuerySubmit) {
      return onQuerySubmit(model)
    }

    setDataLoading(true)
    getAxios().post('/ml', model)
      .then(({ data }) => {
        setData(data)
      })
      // eslint-disable-next-line
      .catch((error) => {
        if (error.response && error.response.data) {
          console.error(error.response.data)
          if (error.response.data.message) {
            return toast.error(error.response.data.message)
          }
        } else {
          console.error(error)
        }
        toast.error('Fail to query, check console and network')
      })
      .finally(() => {
        setDataLoading(false)
      })
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        alignItems: 'center',
      }}
      >
        <CircularProgress style={{ margin: '1rem' }} />
      </div>
    )
  }

  const tableColumns = data && data[0] ? Object.keys(data[0]) : []
  // normalize data
  const displayData = cloneDeep(data)
  if (displayData) {
    displayData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (typeof row[key] === 'object') {
          row[key] = JSON.stringify(row[key])
        }
      })
    })
  }

  return (
    <SplitPane
      split='vertical'
      minSize={150}
      defaultSize={200}
      style={{ height: 'inherit', position: 'inherit' }}
    >
      <Views views={views} />
      <SplitPane split='vertical' defaultSize='40%' minSize={500} maxSize={-200}>
        <Query
          mlModel={mlModel}
          runQuery={runQuery}
          preview={preview}
          dataLoading={dataLoading}
          geoJoin={geoJoin}
        />
        <div>
          <MUIDataTable
            title='Result'
            data={displayData}
            columns={tableColumns}
            options={{
              responsive: 'scroll',
              rowsPerPage: 9,
              elevation: 1,
            }}
          />
        </div>
      </SplitPane>
    </SplitPane>
  )
}

ML.propTypes = propTypes
export default withDragDropContext(ML)
