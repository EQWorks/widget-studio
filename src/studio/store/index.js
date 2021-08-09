import { createStore } from 'easy-peasy'
import { reducer, computed, action, thunk, thunkOn } from 'easy-peasy'

import { _action } from './store-util'

const widgetTypes = ['bar', 'line', 'pie']

const initState = () => ({
  type: '',
  xAxis: '',
  yAxis: [],
  isOpen: true,
})
const controllers = () => ({
  dataSource: null,
  dataID: null,
  data: null, // the final plotly data prop format
  groupedData: null, // data agg stage but not ready to be passed to plotly
  groupingOptions: [], // based on xAxis
  chosenKey: [], // this value is reset when x||yaxis changes
  ready: true, // when data parsing is done
})

const widgetDefaults = {
  bar: {
    group: false,
    groupBy: null,
    indexBy: null,
    stack: false,
    keys: [],
  },
  line: {
    indexByValue: true,
    keys: [],
    x: null,
    y: [],
  },
  pie: {
    indexBy: null,
    keys: [],
  },
  scatter: {
    indexBy: null,
    x: null,
    y: [],
  }
}

export const store = createStore({
  mode: { edit: true, read: false, isEditing: -1 },
  alert: { status: false, message: 'Error' },

  setAlert: _action('alert'),

  /** this is just for the initial selections */
  initState: reducer((prevState = initState(), { payload, type }) => {
    if (type === 'WIDGETS') {
      return { ...prevState, ...payload }
    }
    return prevState
  }),

  /** common states of each chart type */
  controllers: reducer((prevState = controllers(), { payload, type }) => {
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

  /** unique state of each chart type (maybe they can be grouped if not adding more) */

  bar: {
    ...widgetDefaults.bar,
    update: action((state, payload) => ({ ...state, ...payload }))
  },
  line: {
    // area: false,
    // multiAxis: false,
    ...widgetDefaults.line,
    update: action((state, payload) => ({ ...state, ...payload })),
  },
  pie: {
    // donut: false,
    // multi: {},
    ...widgetDefaults.pie,
    update: action((state, payload) => ({ ...state, ...payload })),
    capData: thunk((actions, payload, { dispatch, getStoreState }) => {
      const data = getStoreState()
        .controllers
        .data
        .slice(0, 3)
        .map((chart, i) => {
          chart.domain = {
            column: i % 3 //3 charts per row
          }
          return chart
        })
      dispatch({ type: 'CONTROLLER', payload: { data } })
    })
  },
  scatter: {
    ...widgetDefaults.scatter,
    update: action((state, payload) => ({ ...state, ...payload })),
  },

  config: computed(
    [
      (state) => state.initState.xAxis,
      (state) => state.initState.yAxis,
      (state) => state.initState.type,
      (state) => state.controllers.dataSource,
      (state) => state.controllers.dataID,
      (state) => state.controllers.chosenKey,
      (state) => state[state.initState.type],
    ],
    (
      xAxis,
      yAxis,
      type,
      dataSource,
      dataID,
      chosenKey,
      options,
    ) => ({
      xAxis,
      yAxis,
      type,
      dataSource,
      dataID,
      chosenKey,
      options,
    })
  ),

  hasData: computed(
    [
      (state) => state.controllers.dataSource,
      (state) => state.controllers.dataID,
    ],
    (dataSource, dataID) => {
      return (Boolean(dataSource && dataID))
    }
  ),

  /** checks if all initial states have been filled */
  isDone: computed(
    [
      (state) => state.initState.type,
      (state) => state.barIsDone,
      (state) => state.lineIsDone,
      (state) => state.pieIsDone,
      (state) => state.scatterIsDone,
    ],
    (
      type,
      barIsDone,
      lineIsDone,
      pieIsDone,
      scatterIsDone,
    ) => {
      // TODO there has to be a more elegant way of doing this
      if (!type) return false
      if (type == 'bar') return barIsDone
      if (type == 'line') return lineIsDone
      if (type == 'pie') return pieIsDone
      if (type == 'scatter') return scatterIsDone
    }
  ),

  barIsDone: computed(
    [
      (state) => state.bar.keys,
      (state) => state.bar.group,
      (state) => state.bar.groupBy,
    ],
    (
      keys,
      group,
      groupBy
    ) => {
      if (!group) {
        return Boolean(keys.length)
      }
      return Boolean(keys.length && groupBy)
    }
  ),

  lineIsDone: computed(
    [
      (state) => state.line.indexByValue,
      (state) => state.line.x,
      (state) => state.line.y,
      (state) => state.line.indexBy,
      (state) => state.line.keys,
    ],
    (
      indexByValue,
      x,
      y,
      indexBy,
      keys,
    ) => {
      if (!indexByValue) {
        return Boolean(keys.length > 1)
      }
      return Boolean(x && y.length && indexBy)
    }
  ),

  pieIsDone: computed(
    [
      (state) => state.pie.indexBy,
      (state) => state.pie.keys,
    ],
    (
      indexBy,
      keys,
    ) => Boolean(indexBy && keys.length)
  ),

  scatterIsDone: computed(
    [
      (state) => state.scatter.x,
      (state) => state.scatter.y,
      (state) => state.scatter.indexBy,
    ],
    (
      x,
      y,
      indexBy,
    ) => Boolean(x && y.length && indexBy)
  ),

  resetCurrent: thunk((actions, payload, { getState }) => {
    const type = getState().initState.type
    actions[type].update(widgetDefaults[type])
  }),

  /** called when results change to reset all states */
  reset: thunk((actions, payload, { dispatch }) => {
    dispatch({ type: 'WIDGETS', payload: initState() })
    dispatch({ type: 'CONTROLLER', payload: controllers() })
    widgetTypes.forEach((type) => {
      actions[type].update(widgetDefaults[type])
    })
  }),

  /** listener to clear chosenKey on axis change like an useEffect */
  onAxisChange: thunkOn(
    () => 'WIDGETS', // 👈 the targetResolver function
    (actions, target) => { // handler
      const { xAxis, yAxis } = target.payload
      if (xAxis || yAxis) {
        actions.handleDispatch({ chosenKey: [] })()
      }
    },
  )
}, {
  disableImmer: true,
})
