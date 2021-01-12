import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import { Chip } from '@eqworks/react-labs'

import { useQuery }from 'react-query'
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
  container: {
    margin: 'auto'
  },
  form: {
    margin: theme.spacing(0,2),
    minWidth: 120,
    maxWidth: 300,
  },
}))
// if merged into ml-codebase, add api into actions.js
const api = axios.create({
  baseURL: [
    process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': window.localStorage.getItem('auth_jwt') },
})

// from snoke
const useWhiteLabels = () => {
  const _key = 'Get White Labels'
  const { isError, error, isLoading, data = [] } = useQuery(
    _key,
    () => api.get('/whitelabel').then(({ data = [] }) => data),
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
    { enabled: wlID },
  )

  useEffect(() => {
    if (isError) {
      console.error(`${_key}: ${error.message}`)
    }
  }, [isError, error])

  return [isLoading, data]
}
const WlCuSelector = ({ wlState, cuState }) => {
  const classes = useStyles()
  const [wl, setWl] = wlState
  const [cu, setCu] = cuState

  const [, wlList] = useWhiteLabels()
  const [, cuList = []] = useCustomers(parseInt(wl))

  const onChange = (ref) => ({ target: value }) => {
    const v = parseInt(value.value)
    ref === 'wl'
      ?(setWl(v), setCu(0))
      : setCu(v)
  }

  return (
    <div className={classes.container}>
      <Chip color='warning' label='dev stage' style={{ margin: '16px 0 0 0' }}/>
      <FormControl className={classes.form}>
        <InputLabel id='Whitelabel'>Whitelabel</InputLabel>
        <Select
          value={`${wlList.length ? wl : 0}`}
          onChange={onChange('wl')}
          MenuProps={{ elevation: 1 }}
        >
          <MenuItem value={'0'}>All</MenuItem>
          {wlList.map(({ whitelabelid, company }) => (
            <MenuItem
              key={whitelabelid}
              value={`${whitelabelid}`}
            >
              {`${whitelabelid} - ${company}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.form}>
        <InputLabel id='Customer'>Customer</InputLabel>
        <Select
          value={`${cuList.length ? cu : 0}`}
          onChange={onChange('cu')}
          MenuProps={{ elevation: 1 }}
        >
          <MenuItem value={'0'}>All</MenuItem>
          {cuList.map(({ agencyid, companyname }) => (
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
  )
}

WlCuSelector.propTypes = {
  wlState: PropTypes.array.isRequired,
  cuState: PropTypes.array.isRequired,
}

export default WlCuSelector
