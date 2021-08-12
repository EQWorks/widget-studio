import React, { useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import { useStoreState } from 'easy-peasy'

import { useQuery } from 'react-query'
import axios from 'axios'

import { useSavedQueries } from '../../util/fetch'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    margin: '1rem',
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

const WlCuSelector = ({ selectedWlState, selectedCuState, wlCuLoadingState }) => {
  const classes = useStyles()
  const [selectedWl, setSelectedWl] = selectedWlState
  const [selectedCu, setSelectedCu] = selectedCuState
  const wl = useStoreState((state) => state.wl)
  const cu = useStoreState((state) => state.cu)
  const [wlCuLoading, setWlCuLoading] = wlCuLoadingState

  useEffect(() => {
    setSelectedWl(wl)
    setSelectedCu(cu)
  }, [cu, wl, setSelectedCu, setSelectedWl])

  const [, savedQueryList] = useSavedQueries()
  const [wlListIsLoading, wlList] = useWhiteLabels()
  const [cuListIsLoading, cuList = []] = useCustomers(selectedWl)

  setWlCuLoading(wlListIsLoading || cuListIsLoading)

  useEffect(() => {
    setWlCuLoading(wlListIsLoading || cuListIsLoading)
  }, [cuListIsLoading, setWlCuLoading, wlListIsLoading])

  const getFilteredWhiteLabels = () => {
    return wlList
      .filter((wl) => savedQueryList.filter((q) => q.whitelabelID == wl.whitelabelid).length > 0)
      .sort((a, b) => a.whitelabelid - b.whitelabelid)
  }

  const getFilteredCustomers = () => {
    return cuList
      .filter((cu) => savedQueryList.filter((q) => q.customerID == cu.agencyid).length > 0)
      .sort((a, b) => a.agencyid - b.agencyid)
  }


  var filteredWhiteLabels = useMemo(getFilteredWhiteLabels, [wlList, savedQueryList])
  var filteredCustomers = useMemo(getFilteredCustomers, [cuList, savedQueryList])

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <FormControl disabled={wlListIsLoading || !filteredWhiteLabels.length} className={classes.form}>
          <InputLabel id='Whitelabel'>Whitelabel</InputLabel>
          <Select
            value={`${selectedWl}`}
            onChange={(event) => {
              setSelectedWl(event.target.value)
              setSelectedCu(null)
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
        <FormControl disabled={wlListIsLoading || cuListIsLoading || !filteredWhiteLabels.length} className={classes.form}>
          <InputLabel id='Customer'>Customer</InputLabel>
          <Select
            value={`${selectedCu}`}
            onChange={(event) => setSelectedCu(event.target.value)}
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
  selectedWlState: PropTypes.array.isRequired,
  selectedCuState: PropTypes.array.isRequired,
  wlCuLoadingState: PropTypes.array.isRequired,
}

export default WlCuSelector
