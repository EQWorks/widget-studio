import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { SwitchRect } from '@eqworks/lumen-labs'
import clsx from 'clsx'
import { nanoid } from 'nanoid'


const CustomToggle = ({ label, value, onChange, disabled }) => {
  const [id] = useState(nanoid())
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
      label: clsx('ml-2 text-sm', {
        'text-secondary-500': !disabled,
        'text-secondary-300': disabled,
      }),
    }}
  />
}

CustomToggle.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
}

CustomToggle.defaultProps = {
  disabled: false,
  label: '',
  value: true,
}

export default CustomToggle
