import { useEffect, createElement, useMemo } from 'react'
import Joi from 'joi'

import { useStoreState } from '../../store'
import NivoAdapters from './chart-system/nivo'

// state which adapter set should handle which widget type
const typeDict = {
  bar: NivoAdapters,
  pie: NivoAdapters,
  scatter: NivoAdapters,
  line: NivoAdapters,
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

  const [chart, adapt] = useMemo(() => typeDict[type][type], [type])
  const adaptedConfig = useMemo(() => adapt(rows, config), [adapt, config, rows])

  return createElement(chart, { ...adaptedConfig })
}

export default WidgetAdapter
