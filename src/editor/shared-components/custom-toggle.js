import React from 'react'
import PropTypes from 'prop-types'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'


const CustomToggle = ({ label, value, update, disabled }) =>
  <FormControl>
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={event => update(event.target.checked)}
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
  update: PropTypes.func,
  value: PropTypes.bool
}

export default CustomToggle
