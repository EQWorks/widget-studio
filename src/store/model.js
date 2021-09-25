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
    showDataSourceControls: false,
    staticData: false
  },
  dataSource: {
    type: null,
    id: null,
    loading: false,
    error: null,
    name: null
  },
}

export default {

  /** STATE ------------------------------------------------------------------ */
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
      (state) => state.dataSource.type,
      (state) => state.dataSource.id,
      (state) => state[state.type],
      (state) => state.isReady,
    ],
    (
      title,
      type,
      filters,
      dataSourceType,
      dataSourceID,
      options,
      isReady,
    ) => (
      isReady
        ? {
          title,
          type,
          filters,
          dataSource: {
            type: dataSourceType,
            id: dataSourceID,
          },
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
    const { options, type, ...rest } = payload
    return {
      ...state,
      ...rest,
      type,
      [type]: options,
    }
  }
  ),

  // update the store state
  update: action((state, payload) => ({ ...state, ...payload })),

  // perform a nested update on the store state
  nestedUpdate: action((state, payload) => {
    return Object.entries(payload).reduce((acc, [nestKey, nestedPayload]) => {
      acc[nestKey] = { ...acc[nestKey], ...nestedPayload }
      return acc
    }, state)
  }),

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
