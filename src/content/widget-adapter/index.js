import { useState, useEffect, createElement, useMemo } from 'react'
import PropTypes from 'prop-types'
import { DataFrame } from 'danfojs/src/index'

import { useStoreState } from '../../store'
import PlotlyAdapters from './adapters/chart-system/plotly'

// state which adapter set should handle which widget type
const adapterDict = {
  bar: PlotlyAdapters.bar,
  pie: PlotlyAdapters.pie,
  scatter: PlotlyAdapters.scatter,
  line: PlotlyAdapters.line,
}

// construct a schema to validate adapters, also construct a set of the adapters used above
Object.entries(adapterDict).forEach(([key, adapter]) => {
  PropTypes.checkPropTypes(
    {
      component: PropTypes.elementType.isRequired,
      adapt: PropTypes.func.isRequired,
    },
    adapter,
    'property',
    `adapterDict.${key}`
  )
})

const WidgetAdapter = () => {

  const rows = useStoreState((state) => state.rows)
  const type = useStoreState((state) => state.type)
  const filters = useStoreState((state) => state.filters)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const config = useStoreState((state) => state.config)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)

  const [data, setData] = useState([])
  const { component, adapt } = useMemo(() => adapterDict[type], [type])
  const adaptedDataAndConfig = useMemo(() => adapt(data, config), [adapt, config, data])

  // memoize conversion of raw data to a danfojs dataframe
  const dataframe = useMemo(() => new DataFrame(rows), [rows])

  // drop unused columns when used columns change
  const selectedDataframe = useMemo(() => (
    dataframe.drop({
      inplace: false,
      columns: dataframe.columns.filter(c =>
        !(indexKey === c
          || groupKey === c
          || c in filters
          || c in valueKeys))
    })
  ), [dataframe, filters, groupKey, indexKey, valueKeys])

  // truncate the dataframe when the filters change
  const truncatedDataframe = useMemo(() => (
    Object.keys(filters).length ?
      Object.entries(filters).filter(obj => obj[1] && obj[1].length == 2)
        .reduce((acc, [key, [min, max]]) => (
          acc.query({
            'column': key,
            'is': '>=',
            'to': min,
          }).query({
            'column': key,
            'is': '<=',
            'to': max,
          })
        ), selectedDataframe)
      :
      selectedDataframe
  ), [selectedDataframe, filters])

  // do final processing on the dataframe when appropriate
  const processedDataframe = useMemo(() => (
    group ?
      // aggregate
      truncatedDataframe.groupby([groupKey])
        .agg(
          Object.fromEntries(
            Object.entries(valueKeys).map(([k, { agg }]) =>
              [k, agg ?? 'sum']
            )
          )
        )
      :
      // simply index + sort data if no aggregation
      truncatedDataframe.set_index({ key: indexKey, drop: false }).sort_index()
  ), [group, truncatedDataframe, groupKey, valueKeys, indexKey])

  // convert dataframe back to object literal when final processing is done
  useEffect(() => {
    (async () => setData(JSON.parse(await processedDataframe.to_json())))()
  }, [processedDataframe])

  return createElement(component, adaptedDataAndConfig)
}

export default WidgetAdapter
