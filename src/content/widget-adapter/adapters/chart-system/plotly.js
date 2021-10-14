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
      y: Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`)),
      ...options,
      ...genericOptions
    })
  },
  line: {
    component: PlotlyLineChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKey : config.indexKey,
      y: config.group ? Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`)) : Object.keys(config.valueKeys),
      ...options,
      ...genericOptions
    })
  },
  pie: {
    component: PlotlyPieChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      label: config.groupKey,
      values: Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`)),
      ...options,
      ...genericOptions
    })
  },
  scatter: {
    component: PlotlyScatterChart,
    adapt: (data, { options, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKey : config.indexKey,
      y: config.group ? Object.entries(config.valueKeys).map(([k, { agg }]) => (`${k}_${agg}`)) : Object.keys(config.valueKeys),
      ...options,
      ...genericOptions
    })
  }
}
