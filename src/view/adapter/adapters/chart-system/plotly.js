import PlotlyBarChart from '@eqworks/chart-system/dist/components/plotly/bar'
import PlotlyLineChart from '@eqworks/chart-system/dist/components/plotly/line'
import PlotlyPieChart from '@eqworks/chart-system/dist/components/plotly/pie'
import PlotlyScatterChart from '@eqworks/chart-system/dist/components/plotly/scatter'
import PlotlyPyramidChart from '@eqworks/chart-system/dist/components/plotly/pyramid-bar'

import types from '../../../../constants/types'


export default {
  [types.BAR]: {
    component: PlotlyBarChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => ({
      data,
      x: config.groupKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      orientation: uniqueOptions.horizontal ? 'h' : 'v',
      formatData: config.formatDataFunctions,
      onAfterPlot,
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
      ...(customColors?.chart && { customColors: customColors?.chart }),
    }),
  },
  [types.LINE]: {
    component: PlotlyLineChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => ({
      data,
      x: config.group ? config.groupKeyTitle : config.indexKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      formatData: config.formatDataFunctions,
      onAfterPlot,
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
      ...(customColors?.chart && { customColors: customColors?.chart }),
    }),
  },
  [types.PIE]: {
    component: PlotlyPieChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => ({
      data,
      label: config.groupKeyTitle,
      values: config.valueKeys.map(({ title }) => title),
      onAfterPlot,
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
      ...(customColors?.chart && { customColors: customColors?.chart }),
    }),
  },
  [types.SCATTER]: {
    component: PlotlyScatterChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => ({
      data,
      x: config.group ? config.groupKeyTitle : config.indexKeyTitle,
      y: config.valueKeys.map(({ title }) => title),
      formatData: config.formatDataFunctions,
      onAfterPlot,
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
      ...(customColors?.chart && { customColors: customColors?.chart }),
    }),
  },
  [types.PYRAMID]: {
    component: PlotlyPyramidChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => {
      const { xAxisLabelLength, showWidgetTitle } = genericOptions
      return ({
        data,
        x: config.valueKeys.map(({ title }) => title),
        y: [config.groupKeyTitle],
        formatData: config.formatDataFunctions,
        xAxisLabelLength,
        onAfterPlot,
        ...(showWidgetTitle && { title }),
        ...uniqueOptions,
        ...genericOptions,
        ...(customColors?.chart && { customColors: customColors?.chart }),
      })
    },
  },
}
