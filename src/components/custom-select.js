import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { DropdownSelect, Icons } from '@eqworks/lumen-labs'


const CustomSelect = ({ data, multiSelect, value, onSelect, ...props }) => {
  const transformedData = useMemo(() => ([{ items: data.map(d => ({ title: d })) }]), [data])
  return (
    <DropdownSelect
      classes={{
        button: 'w-full',
        menu: 'w-full',
        contentTitle: 'normal-case text-primary-600 font-medium tracking-widest',
        listContainer: 'normal-case',
      }}
      setSelectedOption={multiSelect ? value?.map(v => ({ title: v })) : { title: value }}
      multiSelect={multiSelect}
      endIcon={<Icons.ChevronDown />}
      data={transformedData}
      onSelect={({ title }) => onSelect(title)}
      {...props}
    />
  )
}

CustomSelect.propTypes = {
  data: PropTypes.array,
  multiSelect: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onSelect: PropTypes.func.isRequired,
}
CustomSelect.defaultProps = {
  data: [],
  multiSelect: false,
  value: '',
}

export default CustomSelect
