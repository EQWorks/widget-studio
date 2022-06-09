import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { SwitchRect } from '@eqworks/lumen-labs'
import clsx from 'clsx'
import { nanoid } from 'nanoid'


const CustomToggle = ({ classes, label, value, onChange, disabled }) => {
  const [id] = useState(nanoid())
  const { label: labelClass = '', ..._classes } = classes
  return <SwitchRect
    id={id}
    checked={value}
    onChange={({ target: { checked } }) => {
      onChange(checked)
    }}
    color="primary"
    disabled={disabled}
    label={label}
    classes={{
      label: clsx(`${labelClass} ml-2 text-xs`, {
        'text-secondary-600': !disabled && !value,
        'text-secondary-400': disabled,
        'text-primary-500': !disabled && value,
      }),
      ..._classes,
    }}
  />
}

CustomToggle.propTypes = {
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
}

CustomToggle.defaultProps = {
  classes: {},
  disabled: false,
  label: '',
  value: true,
}

export default CustomToggle
