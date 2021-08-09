import React, { useState, useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import { useQuery } from 'react-query'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '5px',
    backgroundColor: '#bdbdbd',
    textAlign: 'center',
    display: 'flex',
    marginLeft: '15px',
    marginRight: '15px',
  },
  form: {
    margin: theme.spacing(0, 2),
    minWidth: 120,
    maxWidth: 300,
  },
  selectors: {
    display: 'flex',
    flexDirection: 'row',
  }
}))

const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': window.localStorage.getItem('auth_jwt') },
})

const useSavedQueries = () => {
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

const useExecutions = () => {
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

const QueryExecutionSelector = ({ wlState: [wl], cuState: [cu], dataSourcesLoadingState, disabled, resultsState: [results, setResults] }) => {
  const classes = useStyles()

  const [dataSourcesLoading, setdataSourcesLoading] = dataSourcesLoadingState
  const [queriesLoading, savedQueryList] = useSavedQueries()
  const [executionsLoading, executionsList] = useExecutions()

  // TODO make sure wl is checked as well
  const getFilteredQueries = () => savedQueryList.filter((query) => query.customerID == cu)
  const getFilteredExecutions = () => executionsList.filter((execution) => execution.customerID == cu)

  var filteredQueries = useMemo(getFilteredQueries, [savedQueryList, cu])
  var filteredExecutions = useMemo(getFilteredExecutions, [executionsList, cu])

  const SAVED_QUERIES = 'Saved queries'
  const EXECUTIONS = 'Executions'

  const [selectedDataSource, setSelectedDataSource] = useState(SAVED_QUERIES)

  useEffect(() => {
    setdataSourcesLoading(queriesLoading || executionsLoading)
  }, [executionsLoading, queriesLoading, setdataSourcesLoading])

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

  const dataSelectors = {
    [SAVED_QUERIES]: {
      arr: filteredQueries,
      valState: useState(0),
      render: () => {
        return filteredQueries
          .sort((a, b) => a.queryID - b.queryID)
          .map((query) => (
            <MenuItem
              key={query.queryID}
              value={`${query.queryID}`}
            >
              {`${query.queryID} - ${query.name}`}
            </MenuItem>
          ))
      }
    },

    [EXECUTIONS]: {
      arr: filteredExecutions,
      valState: useState(0),
      render: () => {
        return filteredExecutions
          .sort((a, b) => a.executionID - b.executionID)
          .map((execution) => {
            let label = `${execution.executionID} - ${execution.views[0].name}`
            return (
              <MenuItem
                key={execution.executionID}
                value={`${execution.executionID}`}
              >
                {label}
              </MenuItem>
            )
          })
      }
    }
  }

  const updateData = async (id) => {
    var data

    setResults({ ...results, loading: true })
    if (selectedDataSource == SAVED_QUERIES) {
      data = await requestQueryResults(id)
    }
    else if (selectedDataSource == EXECUTIONS) {
      data = await requestExecutionResults(id)
    }
    setResults({
      columns: data.columns,
      rows: data.results,
      loading: false,
      dataSource: selectedDataSource,
      dataID: id
    })
  }

  return (
    <div className={classes.container}>
      <RadioGroup
        {...{ disabled }}
        className={classes.radioGroup}
        value={selectedDataSource}
        onChange={event => setSelectedDataSource(event.target.value)}
      >
        {Object.entries(dataSelectors)
          .map(([label, selector], index) => {
            return (
              <div key={index} className={classes.selectors}>
                <FormControlLabel
                  {...{ disabled }}
                  value={label}
                  control={<Radio />}
                  label={`${label} (${selector.arr.length})`}
                />
                <FormControl disabled={selectedDataSource != label} className={classes.form}>
                  <Select
                    {...{ disabled }}
                    onChange={(event) => {
                      updateData(event.target.value)
                      selector.valState[1](event.target.value)
                    }
                    }
                    value={`${selector.valState[0] && selector.arr.length ? selector.valState[0] : 0}`}
                    MenuProps={{ elevation: 1 }}
                  >
                    <MenuItem value={'0'}></MenuItem>
                    {selector.render()}
                  </Select>
                </FormControl>
              </div>
            )
          })
        }
      </RadioGroup>
    </div>
  )
}

QueryExecutionSelector.propTypes = {
  wlState: PropTypes.array.isRequired,
  cuState: PropTypes.array.isRequired,
  dataSourcesLoadingState: PropTypes.array.isRequired,
  disabled: PropTypes.bool.isRequired,
  resultsState: PropTypes.array.isRequired,
}

export {
  useSavedQueries,
  QueryExecutionSelector
}
