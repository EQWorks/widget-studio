import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import sampleConfigs from '../../stories/sample-configs'

const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': window.localStorage.getItem('auth_jwt') },
})

export const SAVED_QUERIES = 'Saved query'
export const EXECUTIONS = 'Execution'

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
  const query = await api.get(`/ql/queries/${id}`)
  return await requestExecutionResults(query.data.executions[0].executionID)
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

export const requestData = async (dataSource, dataID) => {
  var data
  if (dataSource == SAVED_QUERIES) {
    data = await requestQueryResults(dataID)
  }
  else if (dataSource == EXECUTIONS) {
    data = await requestExecutionResults(dataID)
  }
  return data
}

// TODO request from db -- this is a placeholder
export const requestConfig = async (id) => {
  return sampleConfigs[id]
}
