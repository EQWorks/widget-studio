import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, TextField } from '@eqworks/lumen-labs'
import Slider from '@material-ui/core/Slider'


const classes = makeStyles({
  controls: {
    width: '100%',
    padding: '1rem',
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
})

const RangeFilterControl = ({ value, min, max, update }) => {
  return (
    <div className={classes.controls}>
      <div className={classes.slider}>
        <Slider
          defaultValue={value || [min, max]}
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
          value={value[0] || min || ''}
          onChange={_min => update([_min, max])}
        />
        <TextField
          label="max"
          type="number"
          deleteButton={false}
          placeholder={max}
          value={value[1] || max || ''}
          onChange={_max => update([min, _max])}
        />
      </div>
    </div >
  )
}

RangeFilterControl.propTypes = {
  index: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
}

export default RangeFilterControl
