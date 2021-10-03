import { PlotlyBarChart, PlotlyPieChart, PlotlyLineChart, PlotlyScatterChart } from '@eqworks/chart-system'

export default {
  bar: [
    PlotlyBarChart,
    (data, { options, genericOptions, ...config }) => ({
      adaptedData: {
        data,
        x: config.groupKey,
        y: Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`))
      },
      adaptedConfig: { ...options, ...genericOptions }
    })
  ],
  line: [
    PlotlyLineChart,
    (data, { options, genericOptions, ...config }) => ({
      adaptedData: {
        data,
        ...(config.group ?
          {
            x: config.groupKey,
            y: Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`))
          }
          :
          {
            x: config.indexKey,
            y: Object.keys(config.valueKeys)
          }
        )
      },
      adaptedConfig: { ...options, ...genericOptions }
    })
  ],
  pie: [
    PlotlyPieChart,
    (data, { options, genericOptions, ...config }) => ({
      adaptedData: {
        data,
        label: config.groupKey,
        values: Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`))
      },
      adaptedConfig: { ...options, ...genericOptions }
    })
  ],
  scatter: [
    PlotlyScatterChart,
    (data, { options, genericOptions, ...config }) => ({
      adaptedData: {
        data,
        ...(config.group ?
          {
            x: config.groupKey,
            y: Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`))
          }
          :
          {
            x: config.indexKey,
            y: Object.keys(config.valueKeys)
          }
        )
      },
      adaptedConfig: { ...options, ...genericOptions }
    })
  ]
}
