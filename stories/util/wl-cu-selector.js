import React, { useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

import { useQuery } from 'react-query'
import axios from 'axios'

import { useSavedQueries } from './query-execution-selector'

// const DEFAULT_WL = 4
// const DEFAULT_CU = 10340 
const DEFAULT_WL = 1532
const DEFAULT_CU = 20524

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '10px',
    backgroundColor: '#bdbdbd',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    margin: theme.spacing(0, 2),
    minWidth: 120,
    maxWidth: 300,
    flexDirection: 'row'
  },
}))
// if merged into ml-codebase, add api into actions.js
const api = axios.create({
  baseURL: [
    process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': window.localStorage.getItem('auth_jwt') },
})

// from snoke
const useWhiteLabels = () => {
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
const useCustomers = (wlID) => {
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

const WlCuSelector = ({ wlState, cuState, wlCuLoadingState }) => {
  const classes = useStyles()
  const [wl, setWl] = wlState
  const [cu, setCu] = cuState
  const [wlCuLoading, setWlCuLoading] = wlCuLoadingState

  const [, savedQueryList] = useSavedQueries()
  const [wlListIsLoading, wlList] = useWhiteLabels()
  const [cuListIsLoading, cuList = []] = useCustomers(wl)

  setWlCuLoading(wlListIsLoading || cuListIsLoading)
  useEffect(() => {
    setWl(DEFAULT_WL)
    setCu(DEFAULT_CU)
  }, [setCu, setWl])

  useEffect(() => {
    setWlCuLoading(wlListIsLoading || cuListIsLoading)
  }, [cuListIsLoading, setWlCuLoading, wlListIsLoading])

  const getFilteredWhiteLabels = () => {
    return wlList
      .filter((wl) => savedQueryList.filter((q) => q.whitelabelID == wl.whitelabelid).length > 0)
      .sort((a, b) => a.whitelabelid - b.whitelabelid)
  }

  const getFilteredCustomers = () => {
    {
      return cuList
        .filter((cu) => savedQueryList.filter((q) => q.customerID == cu.agencyid).length > 0)
        .sort((a, b) => a.agencyid - b.agencyid)
    }
  }


  var filteredWhiteLabels = useMemo(getFilteredWhiteLabels, [wlList, savedQueryList])
  var filteredCustomers = useMemo(getFilteredCustomers, [cuList, savedQueryList])

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <FormControl disabled={wlListIsLoading || !wlList.length} className={classes.form}>
          <InputLabel id='Whitelabel'>Whitelabel</InputLabel>
          <Select
            value={`${wl}`}
            onChange={(event) => {
              setWl(event.target.value)
              setCu(null)
            }}
            MenuProps={{ elevation: 1 }}
          >
            {filteredWhiteLabels
              .map(({ whitelabelid, company }) => (
                <MenuItem
                  key={whitelabelid}
                  value={`${whitelabelid}`}
                >
                  {`${whitelabelid} - ${company}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl disabled={cuListIsLoading || wlCuLoading || !wlList.length} className={classes.form}>
          <InputLabel id='Customer'>Customer</InputLabel>
          <Select
            value={`${cu}`}
            onChange={(event) => setCu(event.target.value)}
            MenuProps={{ elevation: 1 }}
          >
            {filteredCustomers
              .map(({ agencyid, companyname }) => (
                <MenuItem
                  key={agencyid}
                  value={`${agencyid}`}
                >
                  {`${agencyid} - ${companyname}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
    </div>
  )
}

WlCuSelector.propTypes = {
  wlState: PropTypes.array.isRequired,
  cuState: PropTypes.array.isRequired,
  wlCuLoadingState: PropTypes.array.isRequired,
}

export default WlCuSelector
