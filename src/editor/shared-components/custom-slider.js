import React from 'react'
import PropTypes from 'prop-types'
import MuiSlider from '@material-ui/core/Slider'


const CustomSlider = ({ min, max, value, callback }) =>
  <MuiSlider
    valueLabelDisplay='auto'
    defaultValue={value || [min, max]}
    min={min}
    max={max}
    onChange={(event, val) => callback(val)}
  />

CustomSlider.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default CustomSlider
