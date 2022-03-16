import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Table } from '@eqworks/react-labs'
import { Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Parser, transforms } from 'json2csv'

import { useStoreActions, useStoreState } from '../../store'
import CustomButton from '../../components/custom-button'
import CustomModal from '../../components/custom-modal'
import modes from '../../constants/modes'
import WidgetMeta from '../meta'
import CustomToggle from '../../components/custom-toggle'


const classes = makeStyles({
  maximizeButtonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  tableContentContainer: {
    overflow: 'auto',
    padding: '1rem',
  },
  table: {
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

// formerly from util/helpers
const mapFalsy = {
  0: '0',
  undefined: 'Undefined',
  false: 'False',
  true: 'True',
  null: 'NULL',
  '': 'Unknown',
}

// formerly from util/helpers
/* based on https://github.com/EQWorks/lumen-table/blob/af9f54cbb6e8c6e7a44e1bf44645f5da631a14e1/src/table-toolbar/download.js#L15-L44 */
const jsonToCsv = ({ data, rows, visibleColumns, visCols = false, filteredRows = false }) => {
  /* if row value is of type json and any columns are filtered or
    declared, the json values won't be downloaded - as the flattened values
    generate new columns and those are not declared inside `fields`
    https://github.com/zemirco/json2csv/issues/505#issuecomment-741835714
  */
  const cols = (visCols && visibleColumns.length > 0) ? visibleColumns : null
  /* if columns are filtered, csv will contain labeled value:
  value = new_cases
  label = New Cases
  */
  const fields = cols?.map(({ id: value, Header: label }) => ({ value, label }))
  const _rows = filteredRows ? rows.map((r) => r.values) : data
  const { flatten } = transforms
  const json2csvParser = new Parser({
    fields, // if undefined, download all
    transforms: [
      flatten({
        separator: '_',
        objects: true,
        arrays: true,
      }),
    ],
  })
  const csv = json2csvParser.parse(_rows)
  const url = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'data.csv')
  document.body.appendChild(link)

  link.click()
  link.remove()
}

// formerly from util/helpers
const formatCell = ({ value }) => {
  // value is falsey or boolean
  if (!value || !!value === value) {
    return mapFalsy[value]
  }
  // value is array or object
  if (typeof value === 'object') {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          JSON
        </AccordionSummary>
        <AccordionDetails>
          <pre>{JSON.stringify(value, undefined, 2)}</pre>
        </AccordionDetails>
      </Accordion>
    )
  }
  return value
}

const ResultsTable = () => {
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

  const renderTable = (
    <Table
      data={_results}
      downloadFn={jsonToCsv}
    >
      {Object.keys(_results[0] || {})?.map((d) => (
        <Table.Column
          key={d}
          Header={d}
          accessor={d}
          Cell={formatCell}
        />
      ))}
    </Table>
  )

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
    <div>
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
    </div>
  )
}

ResultsTable.propTypes = { results: PropTypes.array }
ResultsTable.defaultProps = { results: [] }

export default ResultsTable
