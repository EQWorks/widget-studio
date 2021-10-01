import { PlotlyBarChart, PlotlyPieChart, PlotlyLineChart, PlotlyScatterChart } from '@eqworks/chart-system'

export default {
  bar: [
    PlotlyBarChart,
    ({ options, genericOptions }) => ({ ...options, ...genericOptions })
  ],
  line: [
    PlotlyLineChart,
    ({ options, genericOptions }) => ({ ...options, ...genericOptions })
  ],
  pie: [
    PlotlyPieChart,
    ({ options, genericOptions }) => ({ ...options, ...genericOptions })
  ],
  scatter: [
    PlotlyScatterChart,
    ({ options, genericOptions }) => ({ ...options, ...genericOptions })
  ]
}
