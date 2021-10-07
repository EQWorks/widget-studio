import { useState, useEffect, createElement, useMemo } from 'react'
import Joi from 'joi'
import * as dfd from 'danfojs/src/index'

import { useStoreState } from '../../store'
// import NivoAdapters from './adapters/chart-system/nivo'
import PlotlyAdapters from './adapters/chart-system/plotly'

// state which adapter set should handle which widget type
const typeDict = {
  bar: PlotlyAdapters,
  pie: PlotlyAdapters,
  scatter: PlotlyAdapters,
  line: PlotlyAdapters,
}

// construct a schema to validate adapters, also construct a set of the adapters used above
let usedAdapters = new Set()
const adapterSchema = Joi.object(
  Object.entries(typeDict).reduce((acc, [key, adapter]) => {
    usedAdapters.add(adapter)
    acc[key] = Joi.array()
    return acc
  }, {})
)

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
  const [chart, adapt] = useMemo(() => typeDict[type][type], [type])
  const { adaptedConfig, adaptedData } = useMemo(() => adapt(data, config), [adapt, config, data])

  // on first load, ensure there are no problems with the imported adapter files
  // TODO: perform a more rigorous validation.
  useEffect(() => {
    usedAdapters.forEach(adapterSet => {
      if (adapterSchema.validate(adapterSet).error) {
        throw new Error('Invalid schema provided to WidgetAdapter')
      }
    })
  }, [])

  // memoize conversion of raw data to a danfojs dataframe
  const dataframe = useMemo(() => new dfd.DataFrame(rows), [rows])

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

  return createElement(chart, {
    ...adaptedData,
    ...adaptedConfig
  })
}

export default WidgetAdapter
