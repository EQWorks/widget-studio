import React, { useState, useEffect } from 'react'
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

const RangeControl = ({ update, value, min, max, step }) => {

  const [rangeValue, setRangeValue] = useState(value)

  useEffect(() => {
    setRangeValue(value)
  }, [value])

  return (
    <div className={classes.controls}>
      <div className={classes.slider}>
        <Slider
          defaultValue={value}
          value={rangeValue}
          onChange={(_, newValue) => setRangeValue(newValue)}
          onChangeCommitted={(_, newValue) => {update(newValue); setRangeValue(newValue)}}
          min={min}
          max={max}
          valueLabelDisplay='auto'
        />
      </div>
      <div className={classes.inputs}>
        <TextField
          label='min'
          type='number'
          min={min}
          max={value[1] || max}
          step={step}
          deleteButton={false}
          placeholder={min}
          value={(value || [])[0]}
          onChange={_min => update([Number(_min), value[1]])}
        />
        <TextField
          label='max'
          type='number'
          min={value[0] || min}
          max={max}
          step={step}
          deleteButton={false}
          placeholder={max}
          value={(value || [])[1]}
          onChange={_max => update([value[0],Number(_max)])}
        />
      </div>
    </div >
  )
}

RangeControl.propTypes = {
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.array,
  update: PropTypes.func.isRequired,
}

RangeControl.defaultProps = {
  step: 0,
  min: 0,
  max: 0,
  value: [],
  update: PropTypes.func.isRequired,
}

export default RangeControl
