import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { BaseComponents, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'
import { DROPDOWN_SELECT_CLASSES as _DROPDOWN_SELECT_CLASSES } from '../../../components/custom-select'


// get rid of classes that aren't available in DropdownBase, to avoid prop-types warnings
const {
  // eslint-disable-next-line no-unused-vars
  listContainer,
  // eslint-disable-next-line no-unused-vars
  selectedOptionTitle,
  ...DROPDOWN_SELECT_CLASSES
} = _DROPDOWN_SELECT_CLASSES

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
  const { root, menu, content, ...dropdownBaseClasses } = DROPDOWN_SELECT_CLASSES
  const click = ({ target }) => open && !disabled && setOpen(ref.current?.contains(target))

  useEffect(() => {
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  })

  return (
    <div className={classes.outerContainer}>
      <BaseComponents.DropdownBase
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
            content: [content, _classes.content].join(' '),
            ...dropdownBaseClasses,
          }
        }
        {...props}
      >
        <div ref={ref}>
          {children}
        </div>
      </BaseComponents.DropdownBase >
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
