import React, { useMemo } from 'react'

import { TextField, Tooltip, Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow, renderToggle, renderItem } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'


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

const BenchmarkControls = () => {
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const resetValue = useStoreActions(actions => actions.resetValue)

  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const addBenchmark = useStoreState((state) => state.addBenchmark)
  const benchmarkHeadline = useStoreState((state) => state.benchmarkHeadline)
  const benchmarkKeyValues = useStoreState((state) => state.benchmarkKeyValues)
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
            'Add Benchmark Controls',
            addBenchmark,
            () => userUpdate({ addBenchmark: !addBenchmark }),
            false,
            <Tooltip
              description={'Benchmark values are unique values used to compare data with.'}
              width='8.5rem'
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
      <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !addBenchmark}>
        <WidgetControlCard
          title='Benchmark Config'
          clear={() => resetValue({ benchmarkKeyValues, benchmarkHeadline })}
        >
          <div className={classes.row}>
            { renderRow('Columns',
              <CustomSelect
                multiSelect
                value={benchmarkKeyValues}
                data={numericColumns}
                onSelect={(val) => {
                  userUpdate({ benchmarkKeyValues: val })}
                }
                icons={Object.values(eligibleColumns).map(({ Icon }) => Icon)}
                disabled={!addBenchmark}
                classes={{
                  root: '',
                  menu: 'w-56',
                  button: 'w-56',
                }}
              />
            )}
          </div>
          {
            renderRow(
              null,
              renderItem('Headline',
                <TextField
                  value={benchmarkHeadline}
                  classes={{ root: 'w-56' }}
                  inputProps={{ placeholder: 'Add benchmark headline' }}
                  onChange={v => userUpdate({ benchmarkHeadline: v })}
                  disabled={!addBenchmark}
                />
              )
            )
          }
        </WidgetControlCard>
      </MutedBarrier>
    </>
  )
}

export default BenchmarkControls
