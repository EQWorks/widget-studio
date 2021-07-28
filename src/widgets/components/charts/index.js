import useBarControls from './bar-controls'
import usePieControls from './pie-controls'
import useLineControls from './line-controls'


export const getChart = (type) => ({ columns, rows }) => {
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

  // const [props, getControl] = useControl({ columns, rows })
  // return { props, getControl }

  return useControl({ columns, rows })
}
