import React, { useMemo } from 'react'

import { TextField, Button, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow, renderSection, renderSuperSection } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'
import types from '../../../constants/types'


const classes = makeStyles({
  button: {
    marginRight: '0.15rem',
  },
  select: {
    width: '19.18rem',
  },
  root: {
    zIndex: 20,
  },
})

const UserValueConfigurationControls = () => {
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const resetValue = useStoreActions(actions => actions.resetValue)

  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const userControlHeadline = useStoreState((state) => state.userControlHeadline)
  const userControlKeyValues = useStoreState((state) => state.userControlKeyValues)
  const dataCategoryKey = useStoreState((state) => state.dataCategoryKey)
  const selectedCategValue = useStoreState((state) => state.selectedCategValue)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const categoryFilter = useStoreState((state) => state.categoryFilter)

  const eligibleCategoryColumns = useMemo(() => (
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) => c !== domain.value && !isNumeric)
        .map(([c, { Icon }]) => [c, { Icon }])
    )
  ), [domain, columnsAnalysis])

  const eligibleValueColumns = useMemo(() =>
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([, { isNumeric }]) => isNumeric))
  , [columnsAnalysis])

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !addUserControls}>
      <WidgetControlCard
        title={type === types.MAP ? 'User Control Configuration' : 'Benchmark Configuration'}
        clear={() => resetValue({
          userControlKeyValues,
          userControlHeadline,
          dataCategoryKey,
          selectedCategValue,
        })}
      >
        {renderSuperSection(
          <>
            {type === types.MAP && renderSection('Category',
              <CustomSelect
                value={categoryFilter}
                data={Object.keys(eligibleCategoryColumns)}
                onSelect={(val) => userUpdate({ categoryFilter: val })}
                onClear={() => userUpdate({ categoryFilter: null })}
                placeholder='Column'
                icons={Object.values(eligibleCategoryColumns).map(({ Icon }) => Icon)}
                disabled={!addUserControls}
                classes={{
                  root: classes.root,
                  menu: classes.select,
                  button: classes.select,
                }}
              />,
            )}
            {renderSection('Values',
              renderRow('Columns',
                <CustomSelect
                  multiSelect
                  placeholder='Columns'
                  value={userControlKeyValues}
                  data={numericColumns}
                  onSelect={(val) => userUpdate({ userControlKeyValues: val })}
                  icons={Object.values(eligibleValueColumns).map(({ Icon }) => Icon)}
                  disabled={!addUserControls}
                  classes={{
                    root: '',
                    menu: classes.select,
                    button: classes.select,
                  }}
                />,
                <div className={classes.button}>
                  <Button
                    size='sm'
                    onClick={() => userUpdate({ userControlKeyValues: numericColumns })}
                  >
                    add all columns
                  </Button>
                </div>,
              )
            )}
            {type === types.BAR && renderSection('Headline',
              <TextField
                value={userControlHeadline}
                classes={{ root: classes.select }}
                inputProps={{ placeholder: 'Add benchmark headline' }}
                onChange={v => userUpdate({ userControlHeadline: v })}
                disabled={!addUserControls}
              />,
            )}
          </>
        )}
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default UserValueConfigurationControls
