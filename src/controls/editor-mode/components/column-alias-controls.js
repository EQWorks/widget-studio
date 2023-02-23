import React, { useState, useEffect, useMemo, createElement } from 'react'

import { TextField, makeStyles, Icons, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import WidgetControlCard from '../../shared/components/widget-control-card'
import CustomButton from '../../../components/custom-button'
import cardTypes from '../../../constants/card-types'


const classes = makeStyles({
  row: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '50% 50%',
    marginBottom: '0.25rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.714rem',
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-500'),
    padding: '0rem 0.7rem 0.25rem 0.2rem',
  },
  headerIcon: {
    height: '0.714rem !important',
    marginRight: '0.4rem',
  },
  columnName: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontSize: '0.786rem',
    overflowWrap: 'anywhere',
    color: getTailwindConfigColor('secondary-800'),
    backgroundColor: getTailwindConfigColor('secondary-100'),
    borderRadius: '0.25rem',
    padding: '0.375rem',
    marginRight: '0.25rem',
  },
  button: {
    marginTop: '.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

const textfieldClasses = Object.freeze({
  container: 'mt-0.5',
})

const ColumnAliasControls = () => {
  const userUpdate = useStoreActions(actions => actions.userUpdate)

  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const columnNameAliases = useStoreState((state) => state.columnNameAliases)
  const aliasesReseted =  useStoreState((state) => state.aliasesReseted)

  const [localColumnNameAliases, setLocalColumnNameAliases] = useState(columnNameAliases)
  const [aliasError, setAliasError] = useState(false)

  useEffect(() => {
    if (Object.keys(columnNameAliases).length && !aliasesReseted) {
      setLocalColumnNameAliases(columnNameAliases)
    }
  }, [columnNameAliases, setLocalColumnNameAliases, aliasesReseted])

  const dataColumns = useMemo(() => (
    Object.entries(columnsAnalysis).map(([c, { Icon }]) => ({ key: c, icon: Icon }) )
  ), [columnsAnalysis])

  return (
    <WidgetControlCard
      title={'Column Alias Configuration'}
      type={cardTypes.DOMAIN}
      clear={() => {
        setLocalColumnNameAliases({})
        let clearedAliases = {}
        Object.keys(columnNameAliases).forEach(key => clearedAliases[key] = '')
        userUpdate({
          aliasesReseted: true,
          columnNameAliases: clearedAliases,
        })
      }}
    >
      <>
        <div className={classes.row}>
          <span className={classes.header}>
            {createElement(Icons.Columns, { size: 'sm', className: classes.headerIcon })}
            {'Columns'}
          </span>
          <span className={classes.header}>
            {createElement(Icons.Alias, { size: 'sm', className: classes.headerIcon })}
            {'Alias'}
          </span>
        </div>
        {dataColumns?.map((col, i) => {
          return (
            <div key={i} className={classes.row}>
              <div className={classes.columnName}>
                {createElement(col.icon, { size: 'sm' })}
                <p className={classes.colKey}>{col.key}</p>
              </div>
              <TextField
                classes={textfieldClasses}
                size={'md'}
                value={localColumnNameAliases[col.key]}
                inputProps={{ placeholder: 'Column title alias' }}
                onChange={(val) => {
                  if (Object.values(localColumnNameAliases).includes(val)) {
                    setAliasError(true)
                  }
                  setLocalColumnNameAliases({
                    ...localColumnNameAliases,
                    [col.key]: val || '',
                  })
                }}
                error={aliasError}
                helperText={aliasError && 'Alias is already in use!'}
              />
            </div>
          )})}
        <div className={classes.button}>
          <CustomButton
            size='sm'
            variant='filled'
            onClick={() => {
              userUpdate({
                aliasesReseted: true,
                columnNameAliases: localColumnNameAliases,
              })
            }}
          >
            submit
          </CustomButton>
        </div>
      </>
    </WidgetControlCard>
  )
}

export default ColumnAliasControls
