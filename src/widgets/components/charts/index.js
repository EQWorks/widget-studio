import {
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
} from '@eqworks/chart-system'
import useBarControls from './bar-controls'


export const getChart = (type = 'bar') => ({ columns, xAxis: _xAxis, yAxis: _yAxis }) => {
  const [barProps, getBarControls] = useBarControls({ columns, xAxis: _xAxis, yAxis: _yAxis })

  return {
    bar: {
      Chart: BarChart,
      props: barProps,
      getControl: getBarControls,
    },
    scatter: { Chart: ScatterChart },
    pie: { Chart: PieChart },
    line: { Chart: LineChart },
  // map: 'map',
  }[type]
}
