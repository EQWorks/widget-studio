import React, { useState, useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useQuery } from 'react-query'
import axios from 'axios'

import { SAVED_QUERIES, EXECUTIONS } from '../../src/util/fetch'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    display: 'flex',
    margin: '1rem'
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

const QueryExecutionSelector = ({ wlState: [wl], cuState: [cu], dataSourcesLoadingState, disabled }) => {
  const classes = useStyles()

  const updateStore = useStoreActions((actions) => actions.update)
  const dataSource = useStoreState((state) => state.dataSource)
  const dataID = useStoreState((state) => state.dataID)

  const [dataSourcesLoading, setdataSourcesLoading] = dataSourcesLoadingState
  const [queriesLoading, savedQueryList] = useSavedQueries()
  const [executionsLoading, executionsList] = useExecutions()

  // TODO make sure wl is checked as well
  const getFilteredQueries = () => savedQueryList.filter((query) => query.customerID == cu)
  const getFilteredExecutions = () => executionsList.filter((execution) => execution.customerID == cu)

  var filteredQueries = useMemo(getFilteredQueries, [savedQueryList, cu])
  var filteredExecutions = useMemo(getFilteredExecutions, [executionsList, cu])

  const [selectedDataSource, setSelectedDataSource] = useState(dataSource)
  useEffect(() => {
    setSelectedDataSource(dataSource)
  }, [dataSource])

  useEffect(() => {
    setdataSourcesLoading(queriesLoading || executionsLoading)
  }, [executionsLoading, queriesLoading, setdataSourcesLoading])

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
                <FormControl className={classes.form}>
                  <Select
                    disabled={disabled || selectedDataSource != label}
                    onChange={(event) => {
                      updateStore({
                        dataSource: `${selectedDataSource}`,
                        dataID: event.target.value
                      })
                      selector.valState[1](event.target.value)
                    }
                    }
                    value={
                      dataSource === label ?
                        dataID
                        :
                        selector.valState[0]
                      // selector.valState[0] && selector.arr.length ? selector.valState[0] : 0
                    }
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
