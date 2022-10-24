import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useDebounce } from 'use-debounce'
import { TextField } from '@eqworks/lumen-labs'
import { useStoreActions } from '../../../store'


const textfieldClasses = Object.freeze({
  container: 'h-8',
})

const ColumnAliasControls = ({ value, disabled }) => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const [alias, setAlias] = useState('')
  const [debouncedAlias] = useDebounce(alias, 1000)

  useEffect(() => userUpdate({ columnNameAliases: { [value]: debouncedAlias } }),
    [userUpdate, value, debouncedAlias])

  return (
    <TextField
      classes={textfieldClasses}
      size={'md'}
      value={alias}
      inputProps={{ placeholder: 'Column title alias' }}
      onChange={setAlias}
      {...{ disabled }}
    />
  )
}

ColumnAliasControls.propTypes = {
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

ColumnAliasControls.defaultProps = {
  disabled: false,
}

export default ColumnAliasControls
