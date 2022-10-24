import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useDebounce } from 'use-debounce'
import { TextField } from '@eqworks/lumen-labs'
import { useStoreActions, useStoreState } from '../../../store'


const textfieldClasses = Object.freeze({
  container: 'mt-0.5',
})

const ColumnAliasControls = ({ value, disabled }) => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const columnNameAliases = useStoreState((state) => state.columnNameAliases || {})
  const [alias, setAlias] = useState(columnNameAliases[value])
  const [debouncedAlias] = useDebounce(alias, 1000)

  const existingAliases = useMemo(() =>
    Object.entries(columnNameAliases).filter(([key, val]) => key !== value && val)
      .map(([, val]) => val)
  , [value, columnNameAliases])

  useEffect(() => {
    if (columnNameAliases[value] !== debouncedAlias &&
      !existingAliases.includes(debouncedAlias)) {
      userUpdate({ columnNameAliases: { [value]: debouncedAlias } })
    }
  }, [userUpdate, value, debouncedAlias, columnNameAliases, existingAliases])

  const aliasError = useMemo(() => Boolean(value && debouncedAlias &&
    existingAliases.includes(debouncedAlias)),
  [value, existingAliases, debouncedAlias])

  return (
    <TextField
      classes={textfieldClasses}
      size={'md'}
      value={alias}
      inputProps={{ placeholder: 'Column title alias' }}
      onChange={setAlias}
      {...{ disabled }}
      error={aliasError}
      helperText={aliasError && 'Alias is already in use!'}
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
