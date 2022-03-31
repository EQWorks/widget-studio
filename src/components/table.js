import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Parser, transforms } from 'json2csv'
import { Table as ReactLabsTable } from '@eqworks/react-labs'

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

// formerly from util/helpers
const mapFalsy = {
  0: '0',
  undefined: 'Undefined',
  false: 'False',
  true: 'True',
  null: 'NULL',
  '': 'Unknown',
}

const Table = ({ rows }) => {
  return (
    <ReactLabsTable
      data={rows}
      downloadFn={jsonToCsv}
    >
      {Object.keys(rows[0] || {})?.map((d) => (
        <ReactLabsTable.Column
          key={d}
          Header={d}
          accessor={d}
          Cell={formatCell}
        />
      ))}
    </ReactLabsTable>
  )
}

Table.propTypes = {
  rows: PropTypes.array,
}
Table.defaultProps = {
  results: [],
}

export default Table
