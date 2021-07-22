import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { Table } from '@eqworks/lumen-table'
import { formatCell, jsonToCsv } from '../../util/helpers'
import { makeStyles } from '@material-ui/core'


const useStyles = makeStyles(() => ({
  table: { backgroundColor: '#fff', width: '100%', height: '100%' },
  get hiddenTable() {
    return {
      ...this.table,
      display: 'none'
    }
  },
}))

const ResultsTable = ({ results, hide }) => {
  const classes = useStyles()
  const [_results, set_results] = useState(results)
  const tableColumns = _results[0] ? Object.keys(_results[0]) : []
  useEffect(() => {
    set_results(results)
  }, [results])
  return (
    <div className={hide ? classes.hiddenTable : classes.table}>
      <Table
        data={_results}
        downloadFn={jsonToCsv}
      >
        {tableColumns.map((d) => (
          <Table.Column
            key={d}
            Header={d}
            accessor={d}
            Cell={formatCell}
          />
        ))}
      </Table>
    </div >
  )
}

ResultsTable.propTypes = { results: PropTypes.array }
ResultsTable.defaultProps = { results: [] }

export default ResultsTable
