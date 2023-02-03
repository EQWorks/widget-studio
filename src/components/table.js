import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Parser, transforms } from 'json2csv'
import { Table as LumenTable } from '@eqworks/lumen-table'
import { makeStyles } from '@eqworks/lumen-labs'


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

const classes = (showHeader) => {
  const tableContainerStyle = showHeader ?
    { height: '100%' } : { height: '90%', marginTop: '1rem' }

  return (
    makeStyles({
      tableContainer: {
        ...tableContainerStyle,
      },
    })
  )
}

const Table = ({
  rows,
  showHeader,
  formatData,
  barColumns,
  barColumnsColor,
  hidePagination,
  headerTitle,
  title,
  defaultStyles,
}) => {
  const _rows = useMemo(() => rows || [], [rows])
  const styles = classes(showHeader)

  const renderTable = (
    <LumenTable
      data={_rows}
      formatData={formatData}
      downloadFn={jsonToCsv}
      toolbar={showHeader}
      barColumns={barColumns}
      barColumnsColor={barColumnsColor}
      hidePagination={hidePagination}
      headerTitle={headerTitle}
      title={title}
      defaultStyles={defaultStyles}
    />
  )

  return (
    <div className={`widget__table-container ${styles.tableContainer}`}>
      {renderTable}
    </div>
  )
}

Table.propTypes = {
  rows: PropTypes.array,
  showHeader: PropTypes.bool,
  formatData: PropTypes.object,
  barColumns: PropTypes.PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  barColumnsColor: PropTypes.string,
  hidePagination: PropTypes.bool,
  headerTitle: PropTypes.bool,
  title: PropTypes.string,
  defaultStyles: PropTypes.object,
}
Table.defaultProps = {
  results: [],
  showHeader: true,
  formatData: {},
  barColumns: false,
  barColumnsColor: '',
  hidePagination: false,
  headerTitle: false,
  title: '',
  defaultStyles: {},
}

export default Table
