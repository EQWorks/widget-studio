import { computed, action, thunk } from 'easy-peasy'

const widgetDefaults = {
  bar: {
    indexBy: null,
    stacked: false,
    spline: false,
    showTicks: true,
    keys: [],
  },
  line: {
    indexBy: null,
    x: null,
    showTicks: true,
    keys: [],
  },
  pie: {
    indexBy: null,
    keys: [],
    donut: false,
    showPercentage: true
  },
  scatter: {
    indexBy: null,
    x: null,
    showTicks: true,
    keys: [],
  }
}

const stateDefaults = {
  title: '',
  rows: [],
  columns: [],
  type: '',
  filters: {},
  truncate: [],
  truncateKey: null,
  wl: null,
  cu: null,
  ui: {
    showTable: false,
    showWidgetControls: false,
    showFilterControls: false,
    showDataControls: false,
    staticData: false
  },
  dataLoading: false,
  dataError: null,
  dataName: null
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
      ],
      (
        keys,
        indexBy
      ) => {
        return Boolean(keys.length && indexBy)
      }
    ),
  },
  line: {
    ...widgetDefaults.line,
    update: action((state, payload) => ({ ...state, ...payload })),
    isReady: computed(
      [
        (state) => state.x,
        (state) => state.keys,
      ],
      (
        x,
        keys,
      ) => {
        return Boolean(keys.length && x)
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
        (state) => state.keys,
      ],
      (
        x,
        keys,
      ) => (Boolean(x && keys.length))
    ),
  },

  /** COMPUTED STATE ------------------------------------------------------------ */

  config: computed(
    [
      (state) => state.title,
      (state) => state.type,
      (state) => state.filters,
      (state) => state.data.source,
      (state) => state.data.id,
      (state) => state[state.type],
      (state) => state.isReady,
    ],
    (
      title,
      type,
      filters,
      dataSource,
      dataID,
      options,
      isReady,
    ) => (
      isReady
        ? {
          title,
          type,
          filters,
          dataSource,
          dataID,
          options,
        }
        : undefined)
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
    if (!payload) {
      return state
    }
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

  // update the ui state specifically
  updateUI: action((state, payload) => ({ ...state, ui: { ...state.ui, ...payload } })),

  // update the filters state specifically
  updateFilters: action((state, payload) => ({ ...state, filters: { ...state.filters, ...payload } })),

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
