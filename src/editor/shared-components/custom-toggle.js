import React from 'react'
import PropTypes from 'prop-types'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'


const CustomToggle = ({ label, value, callback, disabled }) =>
  <FormControl>
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={event => callback(event.target.checked)}
          color="primary"
          disabled={disabled ?? false}
        />
      }
      label={label}
    />
  </FormControl>

CustomToggle.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  callback: PropTypes.func.isRequired,
  value: PropTypes.bool
}

CustomToggle.defaultProps = {
  disabled: false,
  label: '',
  value: true
}

export default CustomToggle
