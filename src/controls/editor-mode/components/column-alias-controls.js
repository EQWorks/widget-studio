import React, { useState, useMemo, createElement } from 'react'

import { TextField, makeStyles, Icons, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import WidgetControlCard from '../../shared/components/widget-control-card'
import cardTypes from '../../../constants/card-types'


const classes = makeStyles({
  row: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    marginBottom: '0.25rem',
    gap: '0.25rem',
  },
  columnName: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    fontSize: '0.786rem',
    color: getTailwindConfigColor('secondary-800'),
    backgroundColor: getTailwindConfigColor('secondary-100'),
    borderRadius: '0.25rem',
    padding: '0.375rem',
  },
  colKey: {
    overflow: 'hidden',
  },
})

const textfieldClasses = Object.freeze({
  container: 'mt-0.5',
})

const ColumnAliasControls = () => {
  // const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)

  // const valueKeys = useStoreState((state) => state.valueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const columnNameAliases = useStoreState((state) => state.columnNameAliases || {})
  // const aliasesReseted =  useStoreState((state) => state.aliasesReseted)
  // const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)

  const [localColumnNameAliases, setLocalColumnNameAliases] = useState(columnNameAliases)
  const [aliasError, setAliasError] = useState(false)

  const dataColumns = useMemo(() => (
    Object.entries(columnsAnalysis).map(([c, { Icon }]) => ({ key: c, icon: Icon }) )
  ), [columnsAnalysis])

  return (
    <WidgetControlCard
      title={'Column Alias Configuration'}
      type={cardTypes.DOMAIN}
      clear={() => userUpdate({
        aliasesReseted: true,
        columnNameAliases: {},
        localColumnNameAliases: {},
      })}
    >
      <>
        {/* <>
          <span className={classes.header}>
            {createElement(Icons.column, { size: 'sm', className: classes.headerIcon })}
            {'Columns'}
          </span>
          <span className={`${classes.header} ${classes.gridTwoColumns}`}>
            {createElement(Icons.alias, { size: 'sm', className: classes.headerIcon })}
            {'Alias'}
          </span>
        </> */}
        {dataColumns?.map((col, i) => (
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
                // userUpdate({ aliasesReseted: false })
                setLocalColumnNameAliases({
                  ...localColumnNameAliases,
                  [col.key]: val || '',
                })
              }}
              // {...{ disabled }}
              error={aliasError}
              helperText={aliasError && 'Alias is already in use!'}
            />
          </div>
        ))}
      </>
    </WidgetControlCard>
  )
}

export default ColumnAliasControls
