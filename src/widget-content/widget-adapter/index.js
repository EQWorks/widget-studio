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
  const keys = useStoreState((state) => state.keys)
  const config = useStoreState((state) => state.config)
  const groupBy = useStoreState((state) => state.groupBy)

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

  // aggregate the dataframe when aggregation settings change
  const aggregatedDataFrame = useMemo(() => (
    groupBy ?
      truncatedDataframe.groupby([groupBy])
        .agg(
          Object.fromEntries(
            Object.entries(keys).map(([k, { agg }]) =>
              [k, agg ?? 'sum']
            )
          )
        )
      :
      truncatedDataframe
  ), [groupBy, keys, truncatedDataframe])

  // assemble final data using completely processed dataframe
  const data = useMemo(() => (
    Object.entries(keys).map(([k, { agg }]) => ({
      name: `${k} (${agg ?? 'sum'})`,
      x: aggregatedDataFrame[groupBy].values,
      y: aggregatedDataFrame[`${k}_${agg ?? 'sum'}`].values,
    }))
  ), [aggregatedDataFrame, groupBy, keys])

  return createElement(chart, {
    data,
    ...adaptedConfig
  })
}

export default WidgetAdapter
