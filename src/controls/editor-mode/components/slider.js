import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { TextField, makeStyles } from '@eqworks/lumen-labs'
import Slider from '@material-ui/core/Slider'


const classes = makeStyles({
  controls: {
    width: '100%',
    padding: '1rem',
  },
  slider: {
    width: '100%',
    padding: '0 1rem',
    display: 'flex',
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

const BasicSlider = ({ min, max, step, value, update }) => {
  const [changedValue, setChangedValue] = useState(value)

  useEffect(() => {
    setChangedValue(value)
  }, [value])

  return (
    <div className={classes.controls}>
      <div className={classes.slider}>
        <Slider
          defaultValue={value}
          value={changedValue}
          onChange={(_, newValue) => setChangedValue(newValue)}
          onChangeCommitted={(_, newValue) => {update(newValue); setChangedValue(newValue)}}
          min={min}
          max={max}
          valueLabelDisplay='auto'
        />
      </div>
      <div className={classes.inputs}>
        {Array.isArray(value) &&
          <TextField
            label='min'
            type='number'
            min={min}
            max={value[1] || max}
            step={step}
            deleteButton={false}
            placeholder={min.toString()}
            value={(value || [])[0] || ''}
            onChange={_min => update([Number(_min), value[1]])}
          />
        }
        <TextField
          label='max'
          type='number'
          min={value[0] || min}
          max={max}
          step={step}
          deleteButton={false}
          placeholder={max.toString()}
          value={(value || [])[1] || value || ''}
          onChange={_max => Array.isArray(value) ?
            update([value[0], Number(_max)]) :
            update(Number(_max))
          }
        />
      </div>
    </div >
  )
}

BasicSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
  ]).isRequired,
  update: PropTypes.func.isRequired,
}

BasicSlider.defaultProps = {
  min: 0,
  max: 0,
  step: 1,
  update: PropTypes.func.isRequired,
}

export default BasicSlider
