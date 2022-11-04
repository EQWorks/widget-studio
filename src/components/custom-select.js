import React, { createElement, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { DropdownSelect, Icons } from '@eqworks/lumen-labs'


export const DROPDOWN_SELECT_CLASSES = {
  root: 'shadow-light-10 border-2 border-secondary-200 rounded-md',
  button: 'tracking-widest border-none max-h-20 overflow-y-auto',
  menu: 'min-w-full z-50',
  content: 'children:fill-current children:text-secondary-500',
  selectedOptionTitle: 'normal-case text-primary-600 truncate overflow-hidden',
  listContainer: 'normal-case',
  innerButton: 'truncate',
}

const { root, ...baseClasses } = DROPDOWN_SELECT_CLASSES

const CustomSelect = ({
  multiSelect,
  userSelect,
  data,
  value,
  onSelect,
  classes,
  onClear,
  fullWidth,
  icons,
  descriptions,
  ...props
}) => {
  const simple = useMemo(() => !(icons || descriptions || userSelect),
    [descriptions, icons, userSelect])

  const transformedData = useMemo(() => {
    if (simple) {
      return data
    }
    return [{
      items: data.map((d, i) => ({
        title: userSelect ? d.title: d,
        ...(icons && { startIcon: createElement(icons[i], { size: 'sm' }) }),
        ...(descriptions && { description: descriptions[i] }),
        value: d.key,
      })),
    }]
  }, [data, descriptions, icons, simple, userSelect])

  const transformedValue = useMemo(() => {
    if (simple) return value
    return multiSelect
      ? (value || []).map(title => ({ title })) || []
      : { title: value }
  }, [multiSelect, simple, value])

  const getTransformedTarget = useCallback(v => {
    if (simple) return v
    return multiSelect
      ? Object.values(v).map(({ title }) => title).filter(Boolean)
      : userSelect ? v.value : v.title
  }, [multiSelect, simple, userSelect])

  return <DropdownSelect
    id='dropdown-select'
    simple={simple}
    classes={{
      root: fullWidth ? [root, 'w-full'].join(' ') : root,
      ...baseClasses,
      ...classes,
    }}
    overflow='vertical'
    endIcon={<Icons.ArrowDown size='md' />}
    onDelete={onClear}
    multiSelect={multiSelect}
    data={transformedData}
    value={transformedValue}
    onSelect={(_, v) => onSelect(getTransformedTarget(v))}
    {...props}
  />
}

CustomSelect.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array,
  multiSelect: PropTypes.bool,
  userSelect: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  fullWidth: PropTypes.bool,
  icons: PropTypes.arrayOf(PropTypes.elementType),
  descriptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node])),
}

CustomSelect.defaultProps = {
  classes: {},
  data: [],
  multiSelect: false,
  userSelect: false,
  value: '',
  onClear: () => { },
  fullWidth: false,
  icons: null,
  descriptions: null,
}

export default CustomSelect
