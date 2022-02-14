import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { BaseComponents, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'
import { DROPDOWN_SELECT_CLASSES } from '../../../components/custom-select'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
  },
  value: {
    color: getTailwindConfigColor('primary-600'),
  },
})

const CustomDropdown = ({ selectedString, classes: _classes, children, disabled, ...props }) => {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const { root, menu, ...dropdownBaseClasses } = DROPDOWN_SELECT_CLASSES
  const click = ({ target }) => !disabled && setOpen(ref.current?.contains(target))
  useEffect(() => {
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  })
  return (
    <div className={classes.outerContainer}>
      <BaseComponents.DropdownBase
        ref={ref}
        open={open}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        placeholder={disabled ? 'N/A' : 'Select'}
        renderSelectedOptions={() =>
          !disabled &&
          <span className={classes.value}>
            {selectedString}
          </span>
        }
        classes={{
          root: [root, _classes.root].join(' '),
          menu: [menu, _classes.menu].join(' '),
          ...dropdownBaseClasses,
        }}
        {...props}
      >
        {children}
      </BaseComponents.DropdownBase >
    </div >
  )
}

CustomDropdown.propTypes = {
  selectedString: PropTypes.string.isRequired,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
}
CustomDropdown.defaultProps = {
  classes: {
    root: '',
    menu: '',
  },
  disabled: false,
}

export default CustomDropdown
