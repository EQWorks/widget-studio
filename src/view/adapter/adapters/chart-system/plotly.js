import PlotlyBarChart from '@eqworks/chart-system/dist/components/plotly/bar'
import PlotlyLineChart from '@eqworks/chart-system/dist/components/plotly/line'
import PlotlyPieChart from '@eqworks/chart-system/dist/components/plotly/pie'
import PlotlyScatterChart from '@eqworks/chart-system/dist/components/plotly/scatter'

import types from '../../../../constants/types'


export default {
  [types.BAR]: {
    component: PlotlyBarChart,
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => ({
      data,
      x: config.groupKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
    }),
  },
  [types.LINE]: {
    component: PlotlyLineChart,
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKeyTitle : config.indexKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
    }),
  },
  [types.PIE]: {
    component: PlotlyPieChart,
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => ({
      data,
      label: config.groupKeyTitle,
      values: config.valueKeys.map(({ title }) => title),
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
    }),
  },
  [types.SCATTER]: {
    component: PlotlyScatterChart,
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => ({
      data,
      x: config.group ? config.groupKeyTitle : config.indexKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
    }),
  },
}
