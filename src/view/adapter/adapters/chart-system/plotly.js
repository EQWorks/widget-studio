import PlotlyBarChart from '@eqworks/chart-system/dist/components/plotly/bar'
import PlotlyLineChart from '@eqworks/chart-system/dist/components/plotly/line'
import PlotlyPieChart from '@eqworks/chart-system/dist/components/plotly/pie'
import PlotlyScatterChart from '@eqworks/chart-system/dist/components/plotly/scatter'


export default {
  bar: {
    component: PlotlyBarChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.groupKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      ...options,
      ...genericOptions,
    }),
  },
  line: {
    component: PlotlyLineChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKeyTitle : config.indexKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      ...options,
      ...genericOptions,
    }),
  },
  pie: {
    component: PlotlyPieChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      label: config.groupKeyTitle,
      values: config.valueKeys.map(({ title }) => title),
      ...options,
      ...genericOptions,
      // overrides
      subPlots: true,
    }),
  },
  scatter: {
    component: PlotlyScatterChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKeyTitle : config.indexKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      ...options,
      ...genericOptions,
    }),
  },
}
