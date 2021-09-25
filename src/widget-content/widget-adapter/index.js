import { useEffect, createElement, useMemo } from 'react'
import Joi from 'joi'

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

  const config = useStoreState((state) => state.config)
  const type = useStoreState((state) => state.config.type)
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)

  // on first load, ensure there are no problems with the imported adapter files
  // TODO: perform a more rigorous validation.
  useEffect(() => {
    usedAdapters.forEach(adapterSet => {
      if (adapterSchema.validate(adapterSet).error) {
        throw new Error('Invalid schema provided to WidgetAdapter')
      }
    })
  }, [])

  // const [chart, adapt] = useMemo(() => typeDict[type][type], [type])
  const [chart, adapt] = useMemo(() => typeDict[type][type], [type])
  const adaptedConfig = useMemo(() => adapt(config), [adapt, config])
  // const adaptedData = useMemo(() => rows.slice(0, 1000), [rows])
  const adaptedData = useMemo(() => rows, [rows])

  return createElement(chart, {
    data: adaptedData,
    columns: columns.map(c => c.name),
    ...adaptedConfig
  })
}

export default WidgetAdapter
