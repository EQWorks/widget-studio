import React from 'react'
import PropTypes from 'prop-types'
import MuiSlider from '@material-ui/core/Slider'


const CustomSlider = ({ min, max, value, update }) =>
  <MuiSlider
    valueLabelDisplay='auto'
    defaultValue={value || [min, max]}
    min={min}
    max={max}
    onChange={(event, val) => update(val)}
  />

CustomSlider.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  update: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.number)
}

export default CustomSlider
