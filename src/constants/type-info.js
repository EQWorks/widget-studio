import types from './types'
import { Icons } from '@eqworks/lumen-labs'
import LocalAdapters from '../view/adapter/adapters/local'
import PlotlyAdapters from '../view/adapter/adapters/chart-system/plotly'
import ReactMapsAdapter from '../view/adapter/adapters/react-maps'


export default {
  [types.LINE]: {
    icon: Icons.LineChart,
    adapter: PlotlyAdapters[types.LINE],
    mustGroup: false,
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
    mustGroup: true,
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
      horizontal: {
        name: 'horizontal',
        type: Boolean,
        defaultValue: false,
      },
    },
  },
  [types.SCATTER]: {
    icon: Icons.ScatterPlot,
    adapter: PlotlyAdapters[types.SCATTER],
    mustGroup: false,
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
    mustGroup: true,
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
  [types.PYRAMID]: {
    icon: Icons.PyramidChart,
    adapter: PlotlyAdapters[types.PYRAMID],
    mustGroup: true,
    uniqueOptions: {
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        defaultValue: true,
      },
      showPercentage: {
        name: 'Percentage',
        type: Boolean,
        defaultValue: false,
      },
    },
  },
  [types.MAP]: {
    icon: Icons.MapChart,
    adapter: ReactMapsAdapter,
    mustGroup: true,
    uniqueOptions: {
      radius: {
        name: 'Radius (px)',
        valueConfigName: 'Radius',
        type: Object,
        defaultValue: {
          value: 10,
          valueOptions: [5, 15],
        },
        info: {
          standard: 'Calculate radius based on the selected column and operation.',
          xwiReport: 'Calculate radius based on the selected column.',
        },
        min: 0,
        max: 100,
        step: 1,
      },
      fill: {
        name: 'Color Fill',
        valueConfigName: 'Color Fill',
        type: Object,
        defaultValue: {
          value: [39, 85, 196],
          valueOptions: [[214, 232, 253], [39, 85, 196]],
        },
        info: {
          standard: 'Calculate fill color based on the selected column and operation.',
          xwiReport: 'Calculate fill color based on the selected column.',
        },
      },
      targetRadius: {
        name: 'Radius (px)',
        valueConfigName: 'Radius',
        type: Object,
        defaultValue: {
          value: 10,
          valueOptions: [5, 15],
        },
        info: {
          xwiReport: 'Calculate radius based on the selected column.',
        },
        min: 0,
        max: 100,
        step: 1,
      },
      targetFill: {
        name: 'Color Fill',
        valueConfigName: 'Color Fill',
        type: Object,
        defaultValue: {
          value: [39, 85, 196],
          valueOptions: [[214, 232, 253], [39, 85, 196]],
        },
        info: {
          xwiReport: 'Calculate fill color based on the selected column.',
        },
      },
      arcWidth: {
        name: 'Arc Width',
        valueConfigName: 'Arc Width',
        type: Object,
        defaultValue: {
          value: 1,
          valueOptions: [1, 20],
        },
        info: {
          xwiReport: 'Calculate arc width based on the selected colum.',
        },
        min: 0,
        max: 20,
        step: 1,
      },
      elevation: {
        name: 'Elevation Height',
        valueConfigName: 'Elevation',
        type: Number,
        defaultValue: {
          value: 1000,
        },
        min: 0,
        max: 500000,
        step: 1,
        info: {
          standard: 'Calculate elevation height based on the selected column and operation.',
        },
      },
      lineWidth: {
        name: 'Outline Width',
        type: Number,
        defaultValue: {
          value: 1,
        },
        min: 0,
        max: 20,
        step: 1,
      },
      opacity: {
        name: 'Opacity',
        type: Number,
        defaultValue: {
          value: 30,
        },
        min: 0,
        max: 100,
        step: 1,
      },
      size: {
        name: 'Size',
        type: Number,
        defaultValue: {
          value: 4,
        },
      },
      mapViewState: {
        name: 'View State',
        type: Object,
        defaultValue: {
          value: {
            latitude: 44.4,
            longitude: -79.23,
            zoom: 7,
          },
          postalCode: {
            latitude: 43.75,
            longitude: -79.4,
            zoom: 10,
          },
        },
      },
    },
  },
  [types.STAT]: {
    icon: Icons.Hash,
    adapter: LocalAdapters[types.STAT],
    mustGroup: false,
    uniqueOptions: {},
  },
  [types.TABLE]: {
    icon: Icons.Table,
    adapter: LocalAdapters[types.TABLE],
    mustGroup: false,
    uniqueOptions: {},
  },
}
