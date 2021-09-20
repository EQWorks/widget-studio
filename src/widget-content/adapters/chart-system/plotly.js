import { PlotlyBarChart, PlotlyPieChart, PlotlyLineChart, PlotlyScatterChart } from '@eqworks/chart-system'

export default {
  bar: [
    PlotlyBarChart,
    (config) => ({
      stacked: config.options.stacked,
      showTicks: config.options.showTicks,
      indexBy: config.options.indexBy,
      keys: config.options.keys.map(obj => obj.name),
      keysAgg: config.options.keys.map(obj => obj.agg),
      filters: config.filters,
    })
  ],
  line: [
    PlotlyLineChart,
    (config) => ({
      x: config.options.x,
      keys: config.options.keys.map(obj => obj.name),
      keysAgg: config.options.keys.map(obj => obj.agg),
      indexBy: config.options.indexBy,
      spline: config.options.spline,
      showTicks: config.options.showTicks,
      filters: config.filters,
    })
  ],
  pie: [
    PlotlyPieChart,
    (config) => ({
      keys: config.options.keys.map(obj => obj.name),
      keysAgg: config.options.keys.map(obj => obj.agg),
      indexBy: config.options.indexBy,
      donut: config.options.donut,
      showPercentage: config.options.showPercentage,
      filters: config.filters,
    }),
  ],
  scatter: [
    PlotlyScatterChart,
    (config) => ({
      x: config.options.x,
      keys: config.options.keys.map(obj => obj.name),
      keysAgg: config.options.keys.map(obj => obj.agg),
      indexBy: config.options.indexBy,
      showTicks: config.options.showTicks,
      filters: config.filters,
    })
  ]
}
