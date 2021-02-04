import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Parser, transforms } from 'json2csv'


// click select columns/filters handlers
export const getColumnData = (column) => {
  const { type, values } = column
  let { data, view } = column
  if (type === 'function') {
    const [, { view: fnColView, data: fnColData }] = values
    data = fnColData
    view = fnColView
  }
  return { type, view, data }
}

export const getSelectedCols = ({ viewId, columns }) => columns.filter((column) => {
  const { view } = getColumnData(column)
  return view.id === viewId
})

export const getSelectedAggCols = ({ viewId, columns }) => {
  const aggCols = getSelectedCols({ viewId, columns }).filter(({ type }) => type === 'function')
  return aggCols.map(({ as, values }) => {
    const [fn, { data: { key } }] = values
    return ({
      category: 'function',
      function: fn.toLowerCase(),
      key: `${fn}(${key})`,
      name: key,
      primary: false,
      type: 'function',
      alias: as || '',
    })
  })
}

export const getColumnIndex = ({ colKey, viewId, columns }) => columns
  .findIndex((column) => {
    const { data, view } = getColumnData(column)
    return data.key === colKey && view.id === viewId
  })

export const getFilterIndex = ({ colKey, viewId, filters }) => filters
  .findIndex(([{ expressions }]) => {
    const o = expressions[0]
    return o.argA.key === colKey && o.argA.view.id === viewId
  })

export const updateAggCols = ({ prevView = {}, currentView, columns }) => {
  if (prevView.columns) {
    const aggCols = getSelectedAggCols({ viewId: prevView.view.id, columns })
    if (aggCols.length) {
      currentView.columns = aggCols.reduce((acc, col) => {
        acc[col.key] = col
        return acc
      }, currentView.columns)
    } else {
      currentView.columns = prevView.columns
    }
  }
  return currentView
}

// clear views if no view columns/filters
export const clearViews = ({ columns, filters, viewId, reset }) => {
  let clear = false
  const viewColumns = getSelectedCols({ viewId, columns })
  const viewFilters = filters.filter(([{ expressions }]) => (expressions[0] || [])?.argA?.view?.id === viewId)
  if ((columns.length === 0 || viewColumns.length === 0) && (reset || viewFilters.length === 1)) {
    clear = true
  }
  if ((filters.length === 0 || viewFilters.length === 0) && (reset || viewColumns.length === 1)) {
    clear = true
  }
  return clear
}

// return viewData arrays from subViews
export const getSubViewData = (viewState) => (type) => Object.values(viewState).map((views) => {
  const view = views.find((view) => view.viewData && view.name === type)
  return view?.viewData
}).filter((v) => v).flat()

const mapFalsy = {
  0 : '0',
  undefined : 'Undefined',
  false: 'False',
  true: 'True',
  null: 'NULL',
  '': 'Unknown',
}

export const errorHandler = (error, key, setAlert) => {
  if (error.response && error.response.data) {
    console.error(error.response.data)
    if (error.response.data.message) {
      return setAlert({ status: true, message: `${key}: ${error.response.data.message}` })
    }
  } else {
    console.error(error)
  }
  return setAlert({ status: true, message: `${key}: Fail to query, check console and network` })
}

export const formatCell = ({ value }) => {
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

/* based on https://github.com/EQWorks/lumen-table/blob/af9f54cbb6e8c6e7a44e1bf44645f5da631a14e1/src/table-toolbar/download.js#L15-L44 */
export const jsonToCsv = ({ data, rows, visibleColumns, visCols = false, filteredRows = false }) => {
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
