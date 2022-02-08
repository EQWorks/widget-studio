import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles, TextField } from '@eqworks/lumen-labs'
import { DropdownBase } from '@eqworks/lumen-labs/dist/base-components'
import Slider from '@material-ui/core/Slider'
import { useStoreState } from '../../../store'
import { DROPDOWN_SELECT_CLASSES } from '../../../components/custom-select'


const classes = makeStyles({
  root: {
    borderTopRightRadius: '0 !important',
    borderBottomRightRadius: '0 !important',
    borderRight: 'none !important',
  },
  outerContainer: {
    width: '100%',
  },
  controls: {
    width: '100%',
    padding: '1rem',
  },
  range: {
    color: getTailwindConfigColor('primary-600'),
  },
  slider: {
    width: '100%',
    padding: '0 1rem',
  },
  inputs: {
    display: 'flex',
    '> *': {
      borderRadius: '0.425rem',
      marginRight: '1rem',
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  menu: {
    width: '12rem !important',
    position: 'absolute',
    overflow: 'visible !important',
  },
})

const FilterDropdown = ({ column, update }) => {
  const filters = useStoreState((state) => state.filters)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)

  const { min, max } = columnsAnalysis[column] || {}
  const [open, setOpen] = useState(false)
  const value = useMemo(() => (filters?.find(({ key }) => key === column))?.filter || [min, max], [column, filters, max, min])

  const { root, menu, ...dropdownBaseClasses } = DROPDOWN_SELECT_CLASSES

  return (
    <div className={classes.outerContainer}>
      <DropdownBase
        open={open}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        placeholder='Range'
        classes={{
          root: [root, classes.root].join(' '),
          menu: [menu, classes.menu].join(' '),
          ...dropdownBaseClasses,
        }}
        renderSelectedOptions={() =>
          column &&
          <span className={classes.range}>{
            (
              value.map(Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format)
            ).join('-')
          }</span>
        }
        disabled={!column}
      >
        <div className={classes.controls}>
          <div className={classes.slider}>
            <Slider
              defaultValue={value}
              onChangeCommitted={(_, newValue) => update(newValue)}
              max={max}
              min={min}
              valueLabelDisplay="auto"
            />
          </div>
          <div className={classes.inputs}>
            <TextField
              label="min"
              type="number"
              deleteButton={false}
              placeholder={min}
              defaultValue={(value || [])[0] || ''}
              onChange={_min => update([_min, max])}
            />
            <TextField
              label="max"
              type="number"
              deleteButton={false}
              placeholder={max}
              defaultValue={(value || [])[1] || ''}
              onChange={_max => update([min, _max])}
            />
          </div>
        </div >
      </DropdownBase >
    </div >
  )
}

FilterDropdown.propTypes = {
  column: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
}

export default FilterDropdown
