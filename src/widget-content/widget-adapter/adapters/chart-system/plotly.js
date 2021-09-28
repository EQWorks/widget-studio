import { PlotlyBarChart, PlotlyPieChart, PlotlyLineChart, PlotlyScatterChart } from '@eqworks/chart-system'

export default {
  bar: [
    PlotlyBarChart,
    (config) => ({ ...config.options })
  ],
  line: [
    PlotlyLineChart,
    (config) => ({ ...config.options })
  ],
  pie: [
    PlotlyPieChart,
    (config) => ({ ...config.options })
  ],
  scatter: [
    PlotlyScatterChart,
    (config) => ({ ...config.options })
  ]
}
