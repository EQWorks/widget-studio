import { useEffect, createElement, useMemo } from 'react'
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

  // on first load, ensure there are no problems with the imported adapter files
  // TODO: perform a more rigorous validation.
  useEffect(() => {
    usedAdapters.forEach(adapterSet => {
      if (adapterSchema.validate(adapterSet).error) {
        throw new Error('Invalid schema provided to WidgetAdapter')
      }
    })
  }, [])

  const [chart, adapt] = useMemo(() => typeDict[type][type], [type])
  const adaptedConfig = useMemo(() => adapt(config), [adapt, config])

  // construct a dataframe when the raw data changes
  const dataframe = useMemo(() => new dfd.DataFrame(rows), [rows])

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
        ), dataframe)
      :
      dataframe
  ), [dataframe, filters])

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
      truncatedDataframe.set_index({ key: indexKey }).sort_index()
  ), [group, truncatedDataframe, groupKey, valueKeys, indexKey])

  // assemble final data using completely processed dataframe
  const data = useMemo(() => (
    Object.entries(valueKeys).map(([k, { agg }]) => (
      group ?
        {
          name: `${k} (${agg ?? 'sum'})`,
          x: processedDataframe[groupKey].values,
          y: processedDataframe[`${k}_${agg ?? 'sum'}`].values,
        }
        :
        {
          name: `${k}`,
          // x: processedDataframe[indexKey].values,
          x: processedDataframe.index,
          y: processedDataframe[k].values,
        }
    ))
  ), [group, groupKey, processedDataframe, valueKeys])

  return createElement(chart, {
    data,
    ...adaptedConfig
  })
}

export default WidgetAdapter
