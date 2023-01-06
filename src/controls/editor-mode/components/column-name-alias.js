import React, { useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useDebounce } from 'use-debounce'
import { TextField } from '@eqworks/lumen-labs'
import { useStoreActions, useStoreState } from '../../../store'


const textfieldClasses = Object.freeze({
  container: 'mt-0.5',
})

const ColumnNameAlias = ({ value, disabled }) => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const columnNameAliases = useStoreState((state) => state.columnNameAliases || {})
  const aliasesReseted =  useStoreState((state) => state.aliasesReseted)
  const [alias, setAlias] = useState(columnNameAliases[value])
  const [debouncedAlias] = useDebounce(value ? alias : '', 300)
  // indicates if we changed key alias in the current component through onChange
  const [aliasChanged, setAliasChanged] = useState(false)

  useEffect(() => {
    setAliasChanged(false)
    setAlias(columnNameAliases[value] || '')
  }, [aliasesReseted, columnNameAliases, value])

  const existingAliases = useMemo(() =>
    Object.entries(columnNameAliases).filter(([key, val]) => key !== value && val)
      .map(([, val]) => val.toLowerCase())
  , [value, columnNameAliases])

  useEffect(() => {
    if (!aliasesReseted && value && columnNameAliases[value] !== debouncedAlias &&
      !existingAliases.includes(debouncedAlias) && aliasChanged) {
      userUpdate({ columnNameAliases: { [value]: debouncedAlias } })
    }
  }, [userUpdate, value, debouncedAlias, columnNameAliases, existingAliases, aliasesReseted, aliasChanged])

  const aliasError = useMemo(() => Boolean(value && alias &&
    existingAliases.includes(alias.toLowerCase())),
  [value, existingAliases, alias])

  return (
    <TextField
      classes={textfieldClasses}
      size={'md'}
      value={alias}
      inputProps={{ placeholder: 'Column title alias' }}
      onChange={(val) => {
        userUpdate({ aliasesReseted: false })
        setAliasChanged(true)
        setAlias(val)
      }}
      {...{ disabled }}
      error={aliasError}
      helperText={aliasError && 'Alias is already in use!'}
    />
  )
}

ColumnNameAlias.propTypes = {
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

ColumnNameAlias.defaultProps = {
  disabled: false,
}

export default ColumnNameAlias
