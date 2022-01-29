import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { DropdownSelect, Icons } from '@eqworks/lumen-labs'


const CustomSelect = ({ classes, onClear, fullWidth, ...props }) => (
  <DropdownSelect simple
    classes={{
      root: clsx('shadow-light-10 border-2 border-secondary-200 rounded-md', {
        'w-full': fullWidth,
      }),
      button: 'tracking-widest border-none',
      menu: 'w-full',
      content: 'children:overflow-hidden children:overflow-ellipsis children:fill-current children:text-secondary-500',
      selectedOptionTitle: 'normal-case text-primary-600',
      listContainer: 'normal-case',
      ...classes,
    }}
    overflow='vertical'
    endIcon={<Icons.ArrowDown size='md' />}
    onDelete={onClear}
    {...props}
  />
)


CustomSelect.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array,
  multiSelect: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  fullWidth: PropTypes.bool,
}
CustomSelect.defaultProps = {
  classes: {},
  data: [],
  multiSelect: false,
  value: '',
  onClear: () => { },
  fullWidth: false,
}

export default CustomSelect
