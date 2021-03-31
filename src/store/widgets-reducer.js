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
  initState: reducer(( prevState = initState(), { payload, type }) => {
    if (type === 'WIDGETS') {
      return { ...prevState, ...payload }
    }
    return prevState
  }),

  controllers: reducer(( prevState = initStateControllers(), { payload, type }) => {
    if (type === 'CONTROLLER') {
      return { ...prevState, ...payload }
    }
    return prevState
  }),

  /** has to be a curried function to work with the <Select/> but also as a regular dispatch */
  handleDispatch: thunk((actions, payload, { dispatch }) => (value = null) => {
    const { type = 'CONTROLLER', key } = payload
    if (value) {
      dispatch({ type, payload: { [key]: value } })
      return
    }
    dispatch({ type, payload })
  }),

  bar: {
    groupMode: 'group',
    layout: 'vertical',
    update: action((state, payload) =>  ({ ...state, ...payload }))
  },
  isJson: computed(
    [(state) => state.initState.yAxis],
    (yAxis) => isJson(yAxis[0])
  ),

  // this to be called when results change probably, but not sure yet
  // widgetsClear: thunk((actions, payload, { dispatch } ) => {
  //   dispatch({ type: 'WIDGETS', payload: initState() })
  //   dispatch({ type: 'WIDGETS', payload: initState() }) // clear controllers
  // }),

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
  // onWidgetsChange: unstable_effectOn(
  //   // Provide an array of "stateResolvers" to resolve the targeted state:
  //   [
  //     (state) => state.widgetsState.type,
  //     (state) => state.widgetsState.xAxis,
  //     (state) => state.widgetsState.yAxis,
  //     (state) => state.widgetsState.isOpen,
  //   ],
  //   // Provide a handler which will execute every time the targeted state changes:
  //   (actions, change) => {
  //     console.log(`%cfired ${Math.random()*100}`, 'background-color: purple')
  //     const [
  //       type,
  //       xAxis,
  //       yAxis,
  //       isOpen,
  //     ] = change.current
  //     const isDone = Boolean(xAxis && yAxis && type && !isOpen)
  //     actions.updateIsDone({ isDone })
  //   }
  // ),
}
