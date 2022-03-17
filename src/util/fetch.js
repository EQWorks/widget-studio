import { useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { dataSourceTypes } from '../constants/data-source'
import { useStoreState } from '../store'


const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE || '',
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
      'eq-api-jwt': token,
    },
  }
})

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
      },
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
  const dev = useStoreState((state) => state.dev)
  const sampleData = useStoreState((state) => state.sampleData)
  const _key = 'Get Query Executions'
  const { isError, error, isLoading, data = [] } = useQuery(
    _key,
    () => sampleData
      ? {}
      : api.get('/ql/executions').then(({ data = [] }) => data) ,
    { refetchOnWindowFocus: false }
  )
  useEffect(() => {
    if (isError) {
      console.error(`${_key}: ${error.message}`)
    }
  }, [isError, error])

  return dev
    ? [false, Object.values(sampleData).map(({ data }) => data)]
    : [isLoading, data]
}

// eslint-disable-next-line no-unused-vars
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
  const data = await api.get(`/ql/executions/${id}`, { params: { results: 1 } })
    .then(res => {
      if (res.data.status == 'SUCCEEDED') {
        return res.data
      }
      throw new Error(`execution has status ${res.data.status}`)
    })

  const { executionID, queryID, views = [] } = data
  let name = `Execution ${executionID}`
  if (queryID) {
    name += await api.get(`/ql/queries/${queryID}`)
      .then(async ({ data: { name: queryName } }) => (
        ` - ${queryName}`
      ))
  } else {
    name += ` - unsaved: ${views.map(({ id }) => id).join(', ')}`
  }
  return { data, name }
}

export const requestData = async (dataSourceType, dataSourceID, sampleData = null) => {
  if (sampleData) {
    return sampleData[`${dataSourceType}-${dataSourceID}`]
  }
  if (dataSourceType == dataSourceTypes.SAVED_QUERIES) {
    return await requestQueryResults(dataSourceID)
  }
  if (dataSourceType == dataSourceTypes.EXECUTIONS) {
    return await requestExecutionResults(dataSourceID)
  }
}

// TODO request from db -- this is a placeholder
export const requestConfig = async (id, sampleConfigs = null) => {
  if (sampleConfigs) {
    return sampleConfigs[id]
  }
}

// get geometry for map polygons
const getGeoPlacePolygon = async (params) => {
  const url = `/poi/geo-place?${Object.keys(params).map(key => key + '=' + params[key]).join('&')}`
  const { data = {} } = await api.get(url, params)
  return data
}

// get geometry for a list of CA regions
export const getRegionPolygons = async (regions) => {
  return await Promise.all(regions.map(region =>
    getGeoPlacePolygon({ region: region.toUpperCase(), country: 'CA', placeType: 'region' })))
    .then(values => {
      if (values?.length) {
        return values
      }
    })
    .catch(err => console.error(`Region polygon retrieval error: ${err}`))
}
