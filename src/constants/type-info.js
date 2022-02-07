import types from './types'
import { Pie, Bar, Line, Scatter, Map } from '../components/icons'
import PlotlyAdapters from '../view/adapter/adapters/chart-system/plotly'
import ReactMapsAdapter from '../view/adapter/adapters/react-maps'


export default {
  [types.LINE]: {
    icon: Line,
    adapter: PlotlyAdapters[types.LINE],
    groupingOptional: true,
    uniqueOptions: {
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        default: true,
      },
      spline: {
        name: 'Spline',
        type: Boolean,
        default: false,
      },
    },
  },
  [types.BAR]: {
    icon: Bar,
    adapter: PlotlyAdapters[types.BAR],
    groupingOptional: false,
    uniqueOptions: {
      stacked: {
        name: 'Stacked',
        type: Boolean,
        default: false,
      },
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        default: true,
      },
    },
  },
  [types.SCATTER]: {
    icon: Scatter,
    adapter: PlotlyAdapters[types.SCATTER],
    groupingOptional: true,
    uniqueOptions: {
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        default: true,
      },
      showLines: {
        name: 'Lines',
        type: Boolean,
        default: false,
      },
    },
  },
  [types.PIE]: {
    icon: Pie,
    adapter: PlotlyAdapters[types.PIE],
    groupingOptional: false,
    uniqueOptions: {
      donut: {
        name: 'Donut',
        type: Boolean,
        default: false,
      },
      showPercentage: {
        name: 'Percentage',
        type: Boolean,
        default: true,
      },
    },
  },
  [types.MAP]: {
    icon: Map,
    adapter: ReactMapsAdapter,
    groupingOptional: false,
    uniqueOptions: {
      showTooltip: {
        name: 'Tooltip',
        type: Boolean,
        default: true,
      },
    },
  },
}
