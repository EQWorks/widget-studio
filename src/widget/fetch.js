import axios from 'axios'

const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': window.localStorage.getItem('auth_jwt') },
})

const SAVED_QUERIES = 'Saved queries'
const EXECUTIONS = 'Executions'

const requestQueryResults = async (id) => {
  const query = await api.get(`/ql/queries/${id}`)
  try {
    return requestExecutionResults(query.data.executions[0].executionID)
  }
  catch (err) {
    return {
      columns: [],
      results: []
    }
  }
}

const requestExecutionResults = (id) => {
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

export const updateData = async (dataSource, dataID) => {
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

