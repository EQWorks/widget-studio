import React, { useMemo } from 'react'

import { TextField, Tooltip, Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow, renderToggle, renderItem } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'
import types from '../../../constants/types'


const classes = makeStyles({
  toggle: {
    margin: '.625rem 0 0 1.5rem',
  },
  row: {
    marginBottom: '.625rem',
  },
  benchmark: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.25rem',
    marginTop: '0.625rem',
    gap: '0.406rem',
  },
  tooltip: {
    marginBottom: '0.2rem',
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
  const numericColumns = useStoreState((state) => state.numericColumns)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)

  const eligibleColumns = useMemo(() =>
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([c, { isNumeric }]) => c !== domain.value && isNumeric)
    ), [columnsAnalysis, domain.value])

  return (
    <>
      <div className={classes.toggle}>
        {
          renderToggle(
            type === types.MAP ? 'Add Value Controls' : 'Add Benchmark',
            addUserControls,
            () => userUpdate({ addUserControls: !addUserControls }),
            false,
            <Tooltip
              description={type === types.MAP ?
                'Add data value controls on the widget' :
                'Benchmark values are unique values used to compare data with.'
              }
              width='9rem'
              arrow={false}
              position='right'
              classes={{
                container: 'mb-0.5',
                content: 'overflow-y-visible',
              }}
            >
              <Icons.AlertInformation
                size='sm'
                color={getTailwindConfigColor('secondary-500')}
              />
            </Tooltip>
          )
        }
      </div>
      <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !addUserControls}>
        <WidgetControlCard
          title={type === types.MAP ? 'User Control Configuration' : 'Benchmark Configuration'}
          clear={() => resetValue({ userControlKeyValues, userControlHeadline })}
        >
          <div className={classes.row}>
            { renderRow('Columns',
              <CustomSelect
                multiSelect
                value={userControlKeyValues}
                data={numericColumns}
                onSelect={(val) => {
                  userUpdate({ userControlKeyValues: val })}
                }
                icons={Object.values(eligibleColumns).map(({ Icon }) => Icon)}
                disabled={!addUserControls}
                classes={{
                  root: '',
                  menu: 'w-56',
                  button: 'w-56',
                }}
              />
            )}
          </div>
          {type === types.BAR &&
            renderRow(
              null,
              renderItem('Headline',
                <TextField
                  value={userControlHeadline}
                  classes={{ root: 'w-56' }}
                  inputProps={{ placeholder: 'Add benchmark headline' }}
                  onChange={v => userUpdate({ userControlHeadline: v })}
                  disabled={!addUserControls}
                />
              )
            )
          }
        </WidgetControlCard>
      </MutedBarrier>
    </>
  )
}

export default UserValueConfigurationControls
