import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../store'
import CustomButton from '../../components/custom-button'
import CustomModal from '../../components/custom-modal'
import modes from '../../constants/modes'
import WidgetMeta from '../meta'
import CustomToggle from '../../components/custom-toggle'
import Table from '../../components/table'


const classes = makeStyles({
  maximizeButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  tableContentContainer: {
    height: '75%',
    padding: '1rem',
  },
  table: {
    height: '100%',
    border: `2px solid ${getTailwindConfigColor('secondary-300')}`,
    borderRadius: '0.425rem',
    fontSize: '0.78rem',
    marginTop: '1rem',
  },
  tableExtra: {
    display: 'flex',
    '> *': {
      background: getTailwindConfigColor('secondary-100'),
      border: `2px solid ${getTailwindConfigColor('secondary-300')}`,
      borderRadius: '0.425rem',
      padding: '0.75rem',
      fontSize: '0.78rem',
      color: getTailwindConfigColor('secondary-800'),
      marginRight: '1rem',
      '&:first-child': {
        flex: 1,
      },
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  tableDisplayControls: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    fontSize: '0.85rem',
  },
  tableRawToggle: {
    fontSize: '0.85rem !important',
  },
})

const WidgetDataTable = () => {
  // store actions
  const update = useStoreActions((actions) => actions.update)

  // widget state
  const type = useStoreState((state) => state.type)
  const rows = useStoreState((state) => state.rows)
  const transformedData = useStoreState((state) => state.transformedData)
  const domain = useStoreState((state) => state.domain)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const tableShowsRawData = useStoreState((state) => state.ui.tableShowsRawData)
  const maximizeTable = useStoreState((state) => state.ui.maximizeTable)

  const showHeader = useMemo(() => mode === modes.EDITOR || maximizeTable, [maximizeTable, mode])
  const showMaximizeButton = useMemo(() => mode !== modes.EDITOR, [mode])

  const _results = useMemo(() => tableShowsRawData ? rows : transformedData, [rows, tableShowsRawData, transformedData])

  const noTransformedData = useMemo(() => (
    !type ||
    !domain.value ||
    !renderableValueKeys?.length ||
    !transformedData?.length
  ), [domain.value, renderableValueKeys?.length, transformedData?.length, type])

  useEffect(() => {
    if (noTransformedData) {
      update({ ui: { tableShowsRawData: true } })
    }
  }, [noTransformedData, update])

  const renderTable = <Table rows={_results} />

  const renderTableWithHeader = (
    showHeader
      ? <div className={classes.tableContentContainer}>
        <div className={classes.tableExtra}>
          <WidgetMeta />
          <div className={classes.tableDisplayControls}>
            Display:
            <CustomToggle
              disabled={noTransformedData}
              classes={{
                label: classes.tableRawToggle,
              }}
              value={tableShowsRawData}
              label='Raw Data'
              onChange={() => update({ ui: { tableShowsRawData: !tableShowsRawData } })}
            />
          </div>
        </div>
        <div className={classes.table}>
          {renderTable}
        </div>
      </div>
      : renderTable
  )
  if (maximizeTable) {
    return (
      <CustomModal
        title='Data Overview'
        onClose={() => update({ ui: { maximizeTable: false } })}
      >
        {renderTableWithHeader}
      </CustomModal>
    )
  }
  return (
    <>
      {
        showMaximizeButton &&
        <div className={classes.maximizeButtonContainer}>
          <CustomButton
            variant='elevated'
            onClick={() => update({ ui: { maximizeTable: true } })}
          >
            <Icons.Expand size='md' />
          </CustomButton>
        </div>
      }
      {renderTableWithHeader}
    </>
  )
}

WidgetDataTable.propTypes = { results: PropTypes.array }
WidgetDataTable.defaultProps = { results: [] }

export default WidgetDataTable
