import { useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import sampleConfigs from '../../stories/sample-configs'


const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE || 'dev',
  ].filter(v => v).join('/'),
})

api.interceptors.request.use(config => {
  const token = window.localStorage.getItem('auth_jwt')
  if (!token) {
    throw new Error('This application is not authorized to make this request.')
  }
  return {
    ...config,
    headers: {
      ...config.headers,
      'eq-api-jwt': token
    }
  }
})

export const SAVED_QUERIES = 'Saved query'
export const EXECUTIONS = 'Execution'

// from snoke
export const useWhiteLabels = () => {
  const _key = 'Get Whitelabels'
  const { isError, error, isLoading, data = [] } = useQuery(
    _key,
    () => api.get('/whitelabel').then(({ data = [] }) => data),
    { refetchOnWindowFocus: false }
  )

  useEffect(() => {
    if (isError) {
      console.error(`${_key}: ${error.message}`)
    }
  }, [isError, error])

  return [isLoading, data]
}

// from snoke
export const useCustomers = (wlID) => {
  const _key = 'Get Customers'
  const { isError, error, isLoading, data = [] } = useQuery(
    [_key, wlID],
    () => api.get('/customer', { params: { wlID } }).then(({ data = [] }) => data),
    { enabled: Boolean(wlID), refetchOnWindowFocus: false },
  )

  useEffect(() => {
    if (isError) {
      console.error(`${_key}: ${error.message}`)
    }
  }, [isError, error])

  return [isLoading, data]
}

export const useSavedQueries = () => {
  const _key = 'Get Queries'
  const { isError, error, isLoading, data = [] } = useQuery(
    _key,
    () => api.get('/ql/queries', {
      params: {
        _wl: '',
        _customer: '',
      }
    }).then(({ data = [] }) => data),
    { refetchOnWindowFocus: false }
  )

  useEffect(() => {
    if (isError) {
      console.error(`${_key}: ${error.message}`)
    }
  }, [isError, error])

  return [isLoading, data]
}

export const useExecutions = () => {
  const _key = 'Get Query Executions'
  const { isError, error, isLoading, data = [] } = useQuery(
    _key,
    () => api.get('/ql/executions').then(({ data = [] }) => data),
    { refetchOnWindowFocus: false }
  )

  useEffect(() => {
    if (isError) {
      console.error(`${_key}: ${error.message}`)
    }
  }, [isError, error])

  return [isLoading, data]
}

const requestQueryResults = async (id) => {
  return api.get(`/ql/queries/${id}`)
    .then(async ({ data: { executions } }) => {
      if (!executions.length) {
        throw new Error('This query has not been executed.')
      }
      return await requestExecutionResults(executions[0].executionID)
    })
}

const requestExecutionResults = async (id) => {
  return api.get(`/ql/executions/${id}`, { params: { results: 1 } })
    .then(res => {
      if (res.data.status == 'SUCCEEDED') {
        return res.data
      }
      throw new Error(`execution has status ${res.data.status}`)
    })
}

export const requestData = async (dataSourceType, dataSourceID) => {
  var data
  if (dataSourceType == SAVED_QUERIES) {
    data = await requestQueryResults(dataSourceID)
  }
  else if (dataSourceType == EXECUTIONS) {
    data = await requestExecutionResults(dataSourceID)
  }
  return data
}

// TODO request from db -- this is a placeholder
export const requestConfig = async (id) => {
  return id ? sampleConfigs[id] : null
}
