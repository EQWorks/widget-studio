import React, { useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import { useStoreState } from '../../store'

import { useWhiteLabels, useCustomers, useSavedQueries } from '../../util/fetch'


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

const WlCuSelector = ({ selectedWl, setSelectedWl, selectedCu, setSelectedCu, setWlCuLoading }) => {
  const classes = useStyles()
  const wl = useStoreState((state) => state.wl)
  const cu = useStoreState((state) => state.cu)

  useEffect(() => {
    setSelectedWl(wl)
    setSelectedCu(cu)
  }, [cu, wl, setSelectedCu, setSelectedWl])

  const [, savedQueryList] = useSavedQueries()
  const [wlListIsLoading, wlList] = useWhiteLabels()
  const [cuListIsLoading, cuList = []] = useCustomers(selectedWl)

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
            value={selectedWl || ''}
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
            value={selectedCu || ''}
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
  selectedCu: PropTypes.number,
  setSelectedCu: PropTypes.func.isRequired,
  selectedWl: PropTypes.number,
  setSelectedWl: PropTypes.func.isRequired,
  setWlCuLoading: PropTypes.func.isRequired,
}

WlCuSelector.defaultProps = {
  selectedCu: null,
  selectedWl: null,
}

export default WlCuSelector
