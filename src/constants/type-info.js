import types from './types'
import { Icons } from '@eqworks/lumen-labs'
import PlotlyAdapters from '../view/adapter/adapters/chart-system/plotly'
import ReactMapsAdapter from '../view/adapter/adapters/react-maps'


export default {
  [types.LINE]: {
    icon: Icons.LineChart,
    adapter: PlotlyAdapters[types.LINE],
    groupingOptional: true,
    uniqueOptions: {
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        defaultValue: true,
      },
      spline: {
        name: 'Spline',
        type: Boolean,
        defaultValue: false,
      },
    },
  },
  [types.BAR]: {
    icon: Icons.BarChart,
    adapter: PlotlyAdapters[types.BAR],
    groupingOptional: false,
    uniqueOptions: {
      stacked: {
        name: 'Stacked',
        type: Boolean,
        defaultValue: false,
      },
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        defaultValue: true,
      },
    },
  },
  [types.SCATTER]: {
    icon: Icons.ScatterPlot,
    adapter: PlotlyAdapters[types.SCATTER],
    groupingOptional: true,
    uniqueOptions: {
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        defaultValue: true,
      },
      showLines: {
        name: 'Lines',
        type: Boolean,
        defaultValue: false,
      },
    },
  },
  [types.PIE]: {
    icon: Icons.PieChart,
    adapter: PlotlyAdapters[types.PIE],
    groupingOptional: false,
    uniqueOptions: {
      donut: {
        name: 'Donut',
        type: Boolean,
        defaultValue: false,
      },
      showPercentage: {
        name: 'Percentage',
        type: Boolean,
        defaultValue: true,
      },
    },
  },
  [types.MAP]: {
    icon: Icons.MapChart,
    adapter: ReactMapsAdapter,
    groupingOptional: false,
    uniqueOptions: {
      opacity: {
        name: 'Opacity',
        type: Number,
        defaultValue: 30,
      },
      lineWidth: {
        name: 'Outline Width',
        type: Number,
        defaultValue: 1,
      },
    },
  },
}
