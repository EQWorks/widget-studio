import React, { useState, useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { useStoreState, useStoreActions } from '../store'

import { SAVED_QUERIES, EXECUTIONS, useSavedQueries, useExecutions } from '../../util/fetch'

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


const QueryExecutionSelector = ({ selectedWl, selectedCu, setDataSourcesLoading, disabled }) => {
  const classes = useStyles()

  const updateStore = useStoreActions((actions) => actions.update)
  const dataSource = useStoreState((state) => state.data.source)
  const dataID = useStoreState((state) => state.data.id)

  const [queriesLoading, savedQueryList] = useSavedQueries()
  const [executionsLoading, executionsList] = useExecutions()
  const filteredQueries = useMemo(
    () => savedQueryList.filter((query) => query.customerID == selectedCu),
    [savedQueryList, selectedCu]
  )
  const filteredExecutions = useMemo(
    () => executionsList.filter((execution) => execution.customerID == selectedCu),
    [executionsList, selectedCu]
  )

  const [selectedDataSource, setSelectedDataSource] = useState(dataSource)
  useEffect(() => {
    setSelectedDataSource(dataSource)
  }, [dataSource])

  useEffect(() => {
    setDataSourcesLoading(queriesLoading || executionsLoading)
  }, [executionsLoading, queriesLoading, setDataSourcesLoading])

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
          .map(([label, { arr, valState: [val, setVal], render }], index) => {
            return (
              <div key={index} className={classes.selectors}>
                <FormControlLabel
                  {...{ disabled }}
                  value={label}
                  control={<Radio />}
                  label={`${label} (${arr.length})`}
                />
                <FormControl className={classes.form}>
                  <Select
                    disabled={disabled || selectedDataSource != label}
                    onChange={(event) => {
                      updateStore({
                        wl: selectedWl,
                        cu: selectedCu,
                        data: {
                          source: `${selectedDataSource}`,
                          id: event.target.value
                        }
                      })
                      setVal(event.target.value)
                    }
                    }
                    value={
                      dataSource === label ?
                        dataID
                        :
                        val
                    }
                    MenuProps={{ elevation: 1 }}
                  >
                    <MenuItem value={'0'}></MenuItem>
                    {render()}
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
  selectedWl: PropTypes.number.isRequired,
  selectedCu: PropTypes.number.isRequired,
  wlState: PropTypes.array.isRequired,
  cuState: PropTypes.array.isRequired,
  setDataSourcesLoading: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  resultsState: PropTypes.array.isRequired,
}

export default QueryExecutionSelector
