import axios from 'axios'
import { sampleConfigs } from '../../stories/sample-data'

const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': window.localStorage.getItem('auth_jwt') },
})

export const SAVED_QUERIES = 'Saved query'
export const EXECUTIONS = 'Execution'

const requestQueryResults = async (id) => {
  const query = await api.get(`/ql/queries/${id}`)
  try {
    return await requestExecutionResults(query.data.executions[0].executionID)
  }
  catch (err) {
    return {
      columns: [],
      results: []
    }
  }
}

const requestExecutionResults = async (id) => {
  return api.get(`/ql/executions/${id}`, { params: { results: 1 } })
    .then(res => {
      if (res.data.status == 'SUCCEEDED') {
        return res.data
      }
      return {
        columns: [],
        results: []
      }
    })
}

export const requestData = async (dataSource, dataID) => {
  var data
  // setResult({ ...result, loading: true })
  if (dataSource == SAVED_QUERIES) {
    data = await requestQueryResults(dataID)
  }
  else if (dataSource == EXECUTIONS) {
    data = await requestExecutionResults(dataID)
  }
  return {
    columns: data.columns,
    rows: data.results,
  }
}

export const requestConfig = async (id) => {
  return sampleConfigs[id]
}
