import types from './types'
import BarControls from '../controls/ql-mode/types/bar'
import ScatterControls from '../controls/ql-mode/types/scatter'
import PieControls from '../controls/ql-mode/types/pie'
import LineControls from '../controls/ql-mode/types/line'
import MapControls from '../controls/ql-mode/types/map'
import { Pie, Bar, Line, Scatter, Map } from '../components/icons'
import PlotlyAdapters from '../view/adapter/adapters/chart-system/plotly'
import ReactMapsAdapter from '../view/adapter/adapters/react-maps'


export default {
  [types.LINE]: {
    icon: Line,
    uniqueControls: LineControls,
    adapter: PlotlyAdapters[types.LINE],
    groupingOptional: true,
  },
  [types.BAR]: {
    icon: Bar,
    uniqueControls: BarControls,
    adapter: PlotlyAdapters[types.BAR],
    groupingOptional: false,
  },
  [types.SCATTER]: {
    icon: Scatter,
    uniqueControls: ScatterControls,
    adapter: PlotlyAdapters[types.SCATTER],
    groupingOptional: true,
  },
  [types.PIE]: {
    icon: Pie,
    uniqueControls: PieControls,
    adapter: PlotlyAdapters[types.PIE],
    groupingOptional: false,
  },
  [types.MAP]: {
    icon: Map,
    uniqueControls: MapControls,
    adapter: ReactMapsAdapter,
    groupingOptional: false,
  },
}
