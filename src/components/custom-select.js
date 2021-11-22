import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { DropdownSelect, Icons } from '@eqworks/lumen-labs'


const CustomSelect = ({
  classes,
  data,
  multiSelect,
  value,
  onSelect,
  onClear,
  ...props
}) => {
  const transformedData = useMemo(() => ([{ items: data.map(d => ({ title: d })) }]), [data])
  return (
    <DropdownSelect
      classes={{
        root: 'shadow-light-10 border-2 border-secondary-200 rounded-md',
        button: 'tracking-widest border-none',
        menu: 'w-full',
        content: 'children:overflow-hidden children:overflow-ellipsis children:fill-current children:text-secondary-400',
        selectedOptionTitle: 'normal-case text-primary-600',
        listContainer: 'normal-case',
        ...classes,
      }}
      setSelectedOption={multiSelect ? value?.map(v => ({ title: v })) : { title: value }}
      multiSelect={multiSelect}
      endIcon={<Icons.ArrowDown size='md' />}
      data={transformedData}
      onSelect={(v) =>
        onSelect(multiSelect
          ? v.map(({ title }) => title)
          : v.title
        )
      }
      {...props}
      onDelete={onClear}
    />
  )
}

CustomSelect.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array,
  multiSelect: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func,
}
CustomSelect.defaultProps = {
  classes: {},
  data: [],
  multiSelect: false,
  value: '',
  onClear: () => { },
}

export default CustomSelect
