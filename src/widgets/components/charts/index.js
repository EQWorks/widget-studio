import useBarControls from './bar-controls'
import usePieControls from './pie-controls'
import useLineControls from './line-controls'


export const getChart = (type) => ({ columns, results }) => {
  const { useControl } = {
    bar: {
      useControl: useBarControls,
    },
    pie: {
      useControl: usePieControls,
    },
    line: {
      useControl: useLineControls
    },
    // scatter: {
    //   useControl: useLineControls
    // },
    // map: {
    //   useControl: useMapControls
    // },
  }[type]

  const [props, getControl, ready] = useControl({ columns, results })

  return { props, getControl, ready }
}
