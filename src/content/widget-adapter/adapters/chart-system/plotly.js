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
        x: config.group ? config.groupKey : config.indexKey,
        y: config.group ? Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`)) : Object.keys(config.valueKeys),
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
        x: config.group ? config.groupKey : config.indexKey,
        y: config.group ? Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`)) : Object.keys(config.valueKeys),
      },
      adaptedConfig: { ...options, ...genericOptions }
    })
  ]
}
