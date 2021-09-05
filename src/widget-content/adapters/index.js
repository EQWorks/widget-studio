import { createElement, useMemo } from 'react'

import { useStoreState } from '../../store'
import NivoAdapters from './chart-system/nivo'
import PlotlyAdapters from './chart-system/plotly'

const typeDict = {
  bar: NivoAdapters,
  pie: NivoAdapters,
  scatter: NivoAdapters,
  line: NivoAdapters,
}

const WidgetAdapter = () => {

  const config = useStoreState((state) => state.config)
  const type = useStoreState((state) => state.config.type)
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)

  const [chart, adapt] = useMemo(() => typeDict[type][type], [type])
  const adaptedConfig = useMemo(() => adapt(rows, config), [adapt, config, rows])

  return createElement(chart, { ...adaptedConfig })
}

export default WidgetAdapter
