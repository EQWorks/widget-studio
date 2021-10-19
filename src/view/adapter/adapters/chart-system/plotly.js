import PlotlyBarChart from '@eqworks/chart-system/dist/components/plotly/bar'
import PlotlyLineChart from '@eqworks/chart-system/dist/components/plotly/line'
import PlotlyPieChart from '@eqworks/chart-system/dist/components/plotly/pie'
import PlotlyScatterChart from '@eqworks/chart-system/dist/components/plotly/scatter'


export default {
  bar: {
    component: PlotlyBarChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.groupKey,
      y: config.valueKeys.map(({ key, agg }) => (`${key}_${agg}`)),
      ...options,
      ...genericOptions
    })
  },
  line: {
    component: PlotlyLineChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKey : config.indexKey,
      y: config.valueKeys.map(({ key, agg }) => config.group ? `${key}_${agg}` : key),
      ...options,
      ...genericOptions
    })
  },
  pie: {
    component: PlotlyPieChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      label: config.groupKey,
      values: config.valueKeys.map(({ key, agg }) => (`${key}_${agg}`)),
      ...options,
      ...genericOptions
    })
  },
  scatter: {
    component: PlotlyScatterChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKey : config.indexKey,
      y: config.valueKeys.map(({ key, agg }) => config.group ? `${key}_${agg}` : key),
      ...options,
      ...genericOptions
    })
  }
}
