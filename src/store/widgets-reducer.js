import { action, reducer, computed, thunk, unstable_effectOn } from 'easy-peasy'


const initialResult = () => ({
  type: '',
  xAxis: '',
  yAxis: '',
  isOpen: true,
  // isDone: false
})

export const widgetsReducer = {
  widgetsState: reducer(( prevResults = initialResult(), { payload, type: _type }) => {
    if (_type === 'WIDGETS') return { ...prevResults, ...payload }
    return { ...prevResults }
  }),

  // updateIsDone: thunk((actions, payload, { dispatch } ) => {
  //   dispatch({ type: 'WIDGETS', payload })
  // }),

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
  isDone: computed(
    [
      (state) => state.widgetsState.type,
      (state) => state.widgetsState.xAxis,
      (state) => state.widgetsState.yAxis,
      (state) => state.widgetsState.isOpen,
    ],
    (
      type,
      xAxis,
      yAxis,
      isOpen,
    ) => Boolean(xAxis && yAxis && type && !isOpen)
  )
}
