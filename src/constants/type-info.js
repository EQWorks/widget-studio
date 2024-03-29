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
      showLineMarkers: {
        name: 'Line Markers',
        type: Boolean,
        defaultValue: true,
      },
      lineFill: {
        name: 'Line Fill',
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
        name: 'Horizontal',
        type: Boolean,
        defaultValue: false,
      },
    },
  },
  [types.BARLINE]: {
    icon: Icons.BarLineChart,
    adapter: PlotlyAdapters[types.BARLINE],
    mustGroup: true,
    uniqueOptions: {
      showTicks: {
        name: 'Ticks',
        type: Boolean,
        defaultValue: true,
      },
      showLineMarkers: {
        name: 'Line Markers',
        type: Boolean,
        defaultValue: true,
      },
      sharedYAxis: {
        name: 'Shared Y Axis',
        type: Boolean,
        defaultValue: true,
      },
      lineFill: {
        name: 'Line Fill',
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
    icon: Icons.Map,
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
    },
  },
  [types.STAT]: {
    icon: Icons.Hash,
    adapter: LocalAdapters[types.STAT],
    mustGroup: true,
    uniqueOptions: {
      selectedTrend: {
        titles: [],
        values: [],
      },
      selectedPercentage: {
        titles: [],
        values: [],
      },
    },
  },
  [types.TABLE]: {
    icon: Icons.Table,
    adapter: LocalAdapters[types.TABLE],
    mustGroup: true,
    uniqueOptions: {
      pagination: {
        name: 'Pagination',
        type: Boolean,
        defaultValue: false,
      },
      headerTitle: {
        name: 'Header Title',
        type: Boolean,
        defaultValue: false,
      },
      compactTable: {
        name: 'Compact Table',
        type: Boolean,
        defaultValue: false,
      },
      centeredHeader: {
        name: 'Centered Header',
        type: Boolean,
        defaultValue: false,
      },
      headerColor: {
        name: 'Header Color',
        type: String,
        defaultValue: 'white',
      },
      borderType: {
        name: 'Border Type',
        type: String,
        defaultValue: 'horizontal',
      },
      barColumns: {
        name: 'Bar Columns',
        type: Array,
        defaultValue: [],
      },
    },
  },
  [types.TEXT]: {
    icon: Icons.Text,
    adapter: LocalAdapters[types.TEXT],
    mustGroup: false,
    uniqueOptions: {},
  },
}
