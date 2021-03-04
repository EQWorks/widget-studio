// import {
//   BarChart,
//   LineChart,
//   ScatterChart,
//   PieChart,
// } from '@eqworks/chart-system'
import useBarControls from './bar-controls'
import usePieControls from './pie-controls'
import useLineControls from './line-controls'


export const getChart = (type = 'bar') => ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const { Chart, useControl } = {
    bar: {
      // Chart: BarChart,
      useControl: useBarControls,
    },
    pie: {
      // Chart: PieChart,
      useControl: usePieControls,
    },
    line: {
      // Chart: LineChart,
      useControl: useLineControls
    },
    // scatter: {
    //   Chart: ScatterChart,
    //   useControl: useLineControls
    // },
    // map: 'map',
  }[type]

  const [props, getControl, ready] = useControl({ columns, xAxis: _xAxis, yAxis: _yAxis, results })

  return { Chart, props, getControl, ready }
}
