import React, { useMemo } from 'react'

import PropTypes from 'prop-types'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Table } from '@eqworks/lumen-table'
import { ThemeProvider, DefaultTheme } from '@eqworks/lumen-ui'
import jsonexport from 'jsonexport'
import { saveAs } from 'file-saver'

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

const downloadCsv = async ({ data }) => (
  jsonexport(data, (err, csv) => {
    err && console.error(err)
    var blob = new Blob([csv], { type: 'text/csv' })
    saveAs(blob, 'data.csv')
  })
)

const DataTable = ({ rows }) => {
  const columns = useMemo(() => Object.keys(rows[0]) || [], [rows])
  return (
    <div>
      <ThemeProvider theme={DefaultTheme}>
        <Table
          data={rows}
          downloadFn={downloadCsv}
        >
          {columns.map((d) => (
            <Table.Column
              key={d}
              Header={d}
              accessor={d}
              Cell={formatCell}
            />
          ))}
        </Table>
      </ThemeProvider>
    </div>
  )
}

DataTable.propTypes = { rows: PropTypes.array }
DataTable.defaultProps = { rows: [] }

export default DataTable
