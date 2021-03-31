import { reducer, computed, action, thunk } from 'easy-peasy'
import { isJson } from '../widgets/components/charts/utils'

const initState = () => ({
  type: '',
  xAxis: '',
  yAxis: [],
  isOpen: true,
})
const initStateControllers = () => ({
  data: null,
  groupedData: null,
  options: [],
  chosenKey: [],
  ready: true
})

export const widgetsReducer = {
  /** this is just for the modal initial selections */
  initState: reducer(( prevState = initState(), { payload, type }) => {
    if (type === 'WIDGETS') {
      return { ...prevState, ...payload }
    }
    return prevState
  }),

  /** common states of each chart type */
  controllers: reducer(( prevState = initStateControllers(), { payload, type }) => {
    if (type === 'CONTROLLER') {
      return { ...prevState, ...payload }
    }
    return prevState
  }),

  /**
   * just a regular dispatch to remove complexity from the components
   * has to be a curried function to work with the <Select/>
   * but also as a regular dispatch
  */
  handleDispatch: thunk((actions, payload, { dispatch }) => (value = null) => {
    const { type = 'CONTROLLER', key } = payload
    if (value) {
      dispatch({ type, payload: { [key]: value } })
      return
    }
    dispatch({ type, payload })
  }),

  /** unique state of each chart type (maybe they can be grouped) */
  bar: {
    groupMode: 'group',
    layout: 'vertical',
    update: action((state, payload) =>  ({ ...state, ...payload }))
  },
  line: {
    area: false,
    multiAxis: false,
    update: action((state, payload) =>  ({ ...state, ...payload }))
  },
  pie: {
    isDonut: false,
    multi: {},
    update: action((state, payload) =>  ({ ...state, ...payload })),
    capData: thunk((actions, payload, { dispatch, getStoreState }) => {
      const data = getStoreState()
        .widgets
        .controllers
        .data
        .slice(0, 3)
        .map((chart, i) => {
          chart.domain =  {
            column: i % 3 //3 charts per row
          }
          return chart
        })
      dispatch({ type: 'CONTROLLER', payload: { data } })
    })
  },

  /** checks if the selected yAxis is hod or dow */
  isJson: computed(
    [(state) => state.initState.yAxis],
    (yAxis) => isJson(yAxis[0])
  ),

  // this to be called when results change probably, but not sure yet
  // widgetsClear: thunk((actions, payload, { dispatch } ) => {
  //   dispatch({ type: 'WIDGETS', payload: initState() })
  //   dispatch({ type: 'WIDGETS', payload: initState() }) // clear controllers
  // add each chart update action here too, basically clear all states
  // }),

  /** checks if all initial states have been filled */
  isDone: computed(
    [
      (state) => state.initState.type,
      (state) => state.initState.xAxis,
      (state) => state.initState.yAxis,
      (state) => state.initState.isOpen,
    ],
    (
      type,
      xAxis,
      yAxis,
      isOpen,
    ) => Boolean(xAxis && yAxis && type && !isOpen)
  ),
}
