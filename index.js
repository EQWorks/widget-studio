import React, { useEffect, useState } from 'react'

import SplitPane from 'react-split-pane'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import CircularProgress from '@material-ui/core/CircularProgress'

import getAxios from '../../helpers/axios/api'
import { withDragDropContext } from './dnd'
import { useMLViews, useMLModel } from './hooks'
import Views from './views'
import Query from './query'


const propTypes = { onQueryResult: PropTypes.func.isRequired }

function ML({ onQueryResult }) {
  const [views, loading] = useMLViews()
  const mlModel = useMLModel()
  // eslint-disable-next-line
  const [data, setData] = useState()
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    window.document.title = 'Locus ML'
  }, [])

  const runQuery = (model) => {
    setDataLoading(true)
    getAxios().post('/ml', model)
      .then(({ data }) => {
        setData(data)
        if (onQueryResult) {
          onQueryResult(data)
        }
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

  if (loading || dataLoading) {
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

  return (
    <SplitPane split='vertical' minSize={150} defaultSize={200} style={{ height: 'inherit' }}>
      <Views views={views} />
      <SplitPane split='vertical' defaultSize='40%' minSize={500} maxSize={-200}>
        <Query mlModel={mlModel} runQuery={runQuery} />
        <div>3456</div>
      </SplitPane>
    </SplitPane>
  )
}

ML.propTypes = propTypes
export default withDragDropContext(ML)
