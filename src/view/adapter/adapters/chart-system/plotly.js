import PlotlyBarChart from '@eqworks/chart-system/dist/components/plotly/bar'
import PlotlyLineChart from '@eqworks/chart-system/dist/components/plotly/line'
import PlotlyPieChart from '@eqworks/chart-system/dist/components/plotly/pie'
import PlotlyScatterChart from '@eqworks/chart-system/dist/components/plotly/scatter'
import PlotlyPyramidChart from '@eqworks/chart-system/dist/components/plotly/pyramid-bar'

import types from '../../../../constants/types'
import { getRoundToNumberDigit } from '../../../../util/numeric'


export default {
  [types.BAR]: {
    component: PlotlyBarChart,
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => ({
      data,
      x: config.groupKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      orientation: uniqueOptions.horizontal ? 'h' : 'v',
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
  [types.PYRAMID]: {
    component: PlotlyPyramidChart,
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => {
      const { xAxisLabelLength, showWidgetTitle } = genericOptions
      let max = 0

      data.forEach((val) => {
        config.valueKeys.forEach(({ title }) => {
          if (val[title] > max) {
            max = val[title]
          }
        })
      })

      const determineGraphVal = max > 10 ? getRoundToNumberDigit(max) : 10

      const xAxisValues = [...Array(xAxisLabelLength).keys()].map((val) => (
        Math.round((determineGraphVal / xAxisLabelLength) * (xAxisLabelLength - val))
      ))

      return ({
        data,
        x: xAxisValues,
        y: config.valueKeys.map(({ title }) => title),
        ...(showWidgetTitle && { title }),
        ...uniqueOptions,
        ...genericOptions,
      })
    },
  },
}
