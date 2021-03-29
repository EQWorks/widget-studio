import { reducer, computed } from 'easy-peasy'


const initState = () => ({
  type: '',
  xAxis: '',
  yAxis: [],
  isOpen: true,
})

export const widgetsReducer = {
  initState: reducer(( prevState = initState(), { payload, type: _type }) => {
    if (_type === 'WIDGETS') {
      return { ...prevState, ...payload }
    }
    return prevState
  }),

  // controllers: reducer()

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
