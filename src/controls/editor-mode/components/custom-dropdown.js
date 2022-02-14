import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'
import { DropdownBase } from '@eqworks/lumen-labs/dist/base-components'

import { DROPDOWN_SELECT_CLASSES } from '../../../components/custom-select'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
  },
  value: {
    color: getTailwindConfigColor('primary-600'),
  },
})

const CustomDropdown = ({ selectedString, classes: _classes, children, disabled, style, ...props }) => {
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
      <DropdownBase
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
        classes={style === 'map' ?
          _classes :
          {
            root: [root, _classes.root].join(' '),
            menu: [menu, _classes.menu].join(' '),
            ...dropdownBaseClasses,
          }
        }
        {...props}
      >
        {children}
      </DropdownBase >
    </div >
  )
}

CustomDropdown.propTypes = {
  style: PropTypes.string,
  selectedString: PropTypes.string.isRequired,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

CustomDropdown.defaultProps = {
  style: 'chart',
  classes: {
    root: '',
    menu: '',
    button: '',
  },
  disabled: false,
}

export default CustomDropdown
