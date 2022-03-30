import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useCustomers, useWhiteLabels } from '../src/util/api'
import CustomSelect from '../src/components/custom-select'


const classes = makeStyles({
  outerContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    background: getTailwindConfigColor('secondary-50'),
    borderBottomColor: getTailwindConfigColor('secondary-300'),
    borderBottomWidth: '2px',
    borderRightColor: getTailwindConfigColor('secondary-300'),
    borderRightWidth: '2px',
    padding: '1rem',
    transition: 'all 0.2s linear 1s',
    borderBottomRightRadius: '0.6rem',
    zIndex: 99,
    height: '5rem',
    opacity: 0.8,
    marginTop: '-4rem',
    minWidth: '20rem',
    '&:hover': {
      opacity: 1,
      marginTop: 0,
      transition: 'all 0.2s linear 0s',
    },
    '> *': {
      flex: 1,
      marginRight: '0.5rem',
    },
    ':last-child': {
      marginRight: '0 !important',
    },
  },
})

const WlCuSelector = ({ wlState, cuState }) => {
  const [wl, setWl] = wlState
  const [cu, setCu] = cuState

  const [, wlList] = useWhiteLabels()
  const [, cuList = []] = useCustomers(wl.index)
  const wlOptions = [
    { label: 'ALL' },
    ...wlList
      .sort((a, b) => a.whiteLabelid - b.whitelabelid)
      .map(({ whitelabelid, company }) => ({ label: `${whitelabelid} - ${company}` })),
  ]

  const cuOptions = [
    { label: 'ALL' },
    ...cuList
      .sort((a, b) => a.agencyid - b.agencyid)
      .map(({ agencyid, companyname }) => ({ label: `${agencyid} - ${companyname}` })),
  ]

  return (
    <div className={classes.outerContainer}>
      <div>
        <p className='font-normal text-xxs tracking-sm text-secondary-600'>Whitelabel:</p>
        <CustomSelect
          fullWidth
          data={wlOptions.map(({ label }) => label)}
          value={wl.value}
          onSelect={value => {
            setWl({ value, index: parseInt(value.split(' -')[0]) || -1 })
            setCu({ value: 'ALL', index: -1 })
          }}
        />
      </div>
      <div>
        <p className='font-normal text-xxs tracking-sm text-secondary-600'>Customer:</p>
        <CustomSelect
          fullWidth
          data={cuOptions.map(({ label }) => label)}
          value={cu.value}
          onSelect={value => setCu({ value, index: parseInt(value.split(' -')[0]) })}
        />
      </div>
    </div>
  )
}

WlCuSelector.propTypes = {
  wlState: PropTypes.array.isRequired,
  cuState: PropTypes.array.isRequired,
}

export default WlCuSelector
