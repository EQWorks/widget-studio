import { computed, action, thunk } from 'easy-peasy'

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
  title: '',
  rows: [],
  columns: [],
  type: '',
  wl: null,
  cu: null,
}

export default {

  /** STATE ------------------------------------------------------------------ */
  data: {
    source: null,
    id: null
  },
  ...stateDefaults,

  /** unique state of each chart type */
  bar: {
    ...widgetDefaults.bar,
    update: action((state, payload) => ({ ...state, ...payload })),
    isReady: computed(
      [
        (state) => state.keys,
        (state) => state.indexBy,
        (state) => state.group,
        (state) => state.groupBy,
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
  },
  line: {
    ...widgetDefaults.line,
    update: action((state, payload) => ({ ...state, ...payload })),
    isReady: computed(
      [
        (state) => state.indexByValue,
        (state) => state.x,
        (state) => state.y,
        (state) => state.indexBy,
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

  },
  pie: {
    ...widgetDefaults.pie,
    update: action((state, payload) => ({ ...state, ...payload })),
    isReady: computed(
      [
        (state) => state.indexBy,
        (state) => state.keys,
      ],
      (
        indexBy,
        keys,
      ) => Boolean(indexBy && keys.length)
    ),
  },
  scatter: {
    ...widgetDefaults.scatter,
    update: action((state, payload) => ({ ...state, ...payload })),
    isReady: computed(
      [
        (state) => state.x,
        (state) => state.y,
        (state) => state.indexBy,
      ],
      (
        x,
        y,
        indexBy,
      ) => (Boolean(x && y.length && indexBy))
    ),
  },

  /** COMPUTED STATE ------------------------------------------------------------ */

  config: computed(
    [
      (state) => state.title,
      (state) => state.type,
      (state) => state.data.source,
      (state) => state.data.id,
      (state) => state[state.type],
    ],
    (
      title,
      type,
      dataSource,
      dataID,
      options,
    ) => ({
      title,
      type,
      dataSource,
      dataID,
      options,
    })
  ),

  hasData: computed(
    [
      (state) => state.data.source,
      (state) => state.data.id,
    ],
    (dataSource, dataID) => {
      return (Boolean(dataSource && dataID))
    }
  ),

  /** checks if all initial states have been filled */
  isReady: computed(
    [
      (state) => state.rows,
      (state) => state.columns,
      (state) => state.type,
      (state) => state.type ? state[state.type].isReady : false
    ],
    (
      rows,
      columns,
      type,
      widgetConfigIsReady,
    ) => {
      if (!type || !columns.length || !rows.length) return false
      return widgetConfigIsReady
    }
  ),

  /** ACTIONS ------------------------------------------------------------------ */

  // set state based on config object that has been passed UP from a child Widget
  readConfig: action((state, payload) => {
    const { options, dataSource, dataID, ...genConfig } = payload
    const widgetType = genConfig.type
    return {
      ...state,
      ...genConfig,
      [widgetType]: options,
      data: {
        source: dataSource,
        id: dataID
      }
    }
  }
  ),

  // update the store state
  update: action((state, payload) => ({ ...state, ...payload })),

  // reset only the current widget's unique state
  resetCurrent: thunk((actions, payload, { getState }) => {
    const type = getState().type
    actions[type].update(widgetDefaults[type])
  }),

  // reset all shared and unique states except data source and data ID
  reset: thunk((actions, payload) => {
    actions.update({ ...stateDefaults })
    Object.entries(widgetDefaults).forEach(([type, defaultValues]) => {
      actions[type].update(defaultValues)
    })
  })
}
