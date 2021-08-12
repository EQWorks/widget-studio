import { createStore } from 'easy-peasy'
import { computed, action, thunk, thunkOn } from 'easy-peasy'

import { _action } from './store-util'

const widgetDefaults = {
  bar: {
    group: false,
    groupBy: null,
    indexBy: null,
    stack: false,
    keys: [],
  },
  line: {
    indexByValue: false,
    indexBy: null,
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

const stateDefaults = {
  type: '',
  xAxis: '',
  yAxis: [],
  isOpen: true,
  dataSource: null,
  dataID: null,
  data: null, // the final plotly data prop format
  groupedData: null, // data agg stage but not ready to be passed to plotly
  groupingOptions: [], // based on xAxis
  chosenKey: [], // this value is reset when x||yaxis changes
  ready: true, // when data parsing is done
  wl: null,
  cu: null,
  dataSourceName: null,
}

export const store = createStore({
  mode: { edit: true, read: false, isEditing: -1 },
  alert: { status: false, message: 'Error' },

  rows: [],
  columns: [],

  setAlert: _action('alert'),

  ...stateDefaults,

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

  readConfig: action((state, payload) => {

    const { options, ...genConfig } = payload
    const widgetType = genConfig.type
    return {
      ...state,
      ...genConfig,
      [widgetType]: options
    }
  }
  ),

  config: computed(
    [
      (state) => state.type,
      (state) => state.dataSource,
      (state) => state.dataID,
      (state) => state[state.type],
    ],
    (
      type,
      dataSource,
      dataID,
      options,
    ) => ({
      type,
      dataSource,
      dataID,
      options,
    })
  ),

  hasData: computed(
    [
      (state) => state.dataSource,
      (state) => state.dataID,
    ],
    (dataSource, dataID) => {
      return (Boolean(dataSource && dataID))
    }
  ),

  /** checks if all initial states have been filled */
  isDone: computed(
    [
      (state) => state.rows,
      (state) => state.columns,
      (state) => state.type,
      (state) => state.barIsDone,
      (state) => state.lineIsDone,
      (state) => state.pieIsDone,
      (state) => state.scatterIsDone,
    ],
    (
      rows,
      columns,
      type,
      barIsDone,
      lineIsDone,
      pieIsDone,
      scatterIsDone,
    ) => {
      // TODO there has to be a more elegant way of doing this
      if (!type || !columns.length || !rows.length) return false
      if (type == 'bar') return barIsDone
      if (type == 'line') return lineIsDone
      if (type == 'pie') return pieIsDone
      if (type == 'scatter') return scatterIsDone
    }
  ),

  barIsDone: computed(
    [
      (state) => state.bar.keys,
      (state) => state.bar.indexBy,
      (state) => state.bar.group,
      (state) => state.bar.groupBy,
    ],
    (
      keys,
      indexBy,
      group,
      groupBy
    ) => {
      if (!group) {
        return Boolean(keys.length && indexBy)
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
    ],
    (
      indexByValue,
      x,
      y,
      indexBy,
    ) => {
      return indexByValue ? Boolean(x && y.length && indexBy) : Boolean(x && y.length)
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
    ) => (Boolean(x && y.length && indexBy))
  ),

  update: action((state, payload) => ({ ...state, ...payload })),

  resetCurrent: thunk((actions, payload, { getState }) => {
    const type = getState().type
    actions[type].update(widgetDefaults[type])
  }),

  /** called when results change to reset all states */
  reset: thunk((actions, payload, { getState }) => {
    const { dataSource, dataID } = getState()
    actions.update({ ...stateDefaults, dataSource, dataID })
    Object.entries(widgetDefaults).forEach(([type, defaultValues]) => {
      actions[type].update(defaultValues)
    })
  }),

  /** listener to clear chosenKey on axis change like an useEffect */
  onAxisChange: thunkOn(
    () => 'WIDGETS', // 👈 the targetResolver function
    (actions, target) => { // handler
      const { xAxis, yAxis } = target.payload
      if (xAxis || yAxis) {
        // obsolete:
        // actions.handleDispatch({ chosenKey: [] })()
      }
    },
  )
}, {
  disableImmer: true,
})
