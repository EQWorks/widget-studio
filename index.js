import React, { useEffect, useState } from 'react'

import SplitPane from 'react-split-pane'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import CircularProgress from '@material-ui/core/CircularProgress'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from 'mui-datatables'
import produce from 'immer'

import getAxios from '../../helpers/axios/api'
import { withDragDropContext } from '../../common-components/drag-n-drop/dnd'
import { useMLViews, useMLModel } from './hooks'
import Views from './views'
import Query from './query'


const propTypes = {
  views: PropTypes.object,
  viewsloading: PropTypes.bool,
  geoJoin: PropTypes.bool,
  noTitle: PropTypes.bool,
  onQuerySubmit: PropTypes.func,
}

const defaultProps = {
  views: null,
  viewsloading: undefined,
  geoJoin: false,
  noTitle: false,
  onQuerySubmit: null,
}

function ML({ onQuerySubmit, views: existingViews, viewsloading, geoJoin, noTitle }) {
  let [views, loading] = useMLViews(viewsloading)
  if (viewsloading !== undefined) {
    views = existingViews
    loading = viewsloading
  }

  const mlModel = useMLModel(views, geoJoin)
  // eslint-disable-next-line
  const [data, setData] = useState()
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    if (!noTitle) {
      window.document.title = 'Locus ML'
    }
  }, [noTitle])

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
  const displayData = produce(data, (draftData) => {
    if (draftData) {
      draftData.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (typeof row[key] === 'object') {
            row[key] = JSON.stringify(row[key])
          }
        })
      })
    }
  })


  const getMuiTheme = () =>
    createMuiTheme({ overrides: { MUIDataTableSelectCell: { headerCell: { zIndex: 0 } } } })

  return (
    <SplitPane
      split='vertical'
      minSize={150}
      defaultSize={200}
      style={{ height: 'inherit', position: 'inherit' }}
    >
      <Views views={views} />
      <SplitPane split='vertical' defaultSize='50%' minSize={500} maxSize={-200}>
        <Query
          mlModel={mlModel}
          runQuery={runQuery}
          dataLoading={dataLoading}
          geoJoin={geoJoin}
        />
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title='Result'
            data={displayData}
            columns={tableColumns}
            options={{
              responsive: 'scrollFullHeight',
              elevation: 0,
            }}
          />
        </MuiThemeProvider>
      </SplitPane>
    </SplitPane>
  )
}

ML.propTypes = propTypes
ML.defaultProps = defaultProps
export default withDragDropContext(ML)
