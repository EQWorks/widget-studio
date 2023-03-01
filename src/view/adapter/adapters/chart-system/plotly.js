import PlotlyBarChart from '@eqworks/chart-system/dist/components/plotly/bar'
import PlotlyLineChart from '@eqworks/chart-system/dist/components/plotly/line'
import PlotlyPieChart from '@eqworks/chart-system/dist/components/plotly/pie'
import PlotlyScatterChart from '@eqworks/chart-system/dist/components/plotly/scatter'
import PlotlyPyramidChart from '@eqworks/chart-system/dist/components/plotly/pyramid-bar'
import { PlotlyBarLineChart } from '@eqworks/chart-system'

import types from '../../../../constants/types'
import { CHART_Z_POSITIONS } from '../../../../constants/viz-options'


export default {
  [types.BAR]: {
    component: PlotlyBarChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => ({
      data,
      x: config.groupKey,
      y: config.valueKeys.map(({ key }) => key),
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
      x: config.group ? config.groupKey : config.indexKey,
      y: config.valueKeys.map(({ key }) => key),
      formatData: config.formatDataFunctions,
      onAfterPlot,
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
      ...(customColors?.chart && { customColors: customColors?.chart }),
    }),
  },
  [types.BARLINE]: {
    component: PlotlyBarLineChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => ({
      data,
      x: config.groupKey,
      y: config.valueKeys.map(({ key }) => key),
      y2: config.chart2ValueKeys.map(({ key }) => key),
      formatData: config.formatDataFunctions,
      onAfterPlot,
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
      ...(customColors?.chart && { customColors: customColors?.chart }),
      chartOverlay: genericOptions.chart1ZPosition === CHART_Z_POSITIONS.front,
    }),
  },
  [types.PIE]: {
    component: PlotlyPieChart,
    adapt: (data, { title, uniqueOptions, genericOptions, onAfterPlot, customColors, ...config }) => ({
      data,
      label: config.groupKey,
      values: config.valueKeys.map(({ key }) => key),
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
      x: config.group ? config.groupKey : config.indexKey,
      y: config.valueKeys.map(({ key }) => key),
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
        x: config.valueKeys.map(({ key }) => key),
        y: [config.groupKey],
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
