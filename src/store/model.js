import { computed, action, thunk } from 'easy-peasy'

const widgetDefaults = {
  bar: {
    stacked: false,
    spline: false,
    showTicks: true,
  },
  line: {
    showTicks: true,
  },
  pie: {
    donut: false,
    showPercentage: true
  },
  scatter: {
    showTicks: true,
  }
}

const stateDefaults = {
  title: '',
  rows: [],
  columns: [],
  type: '',
  filters: {},
  groupBy: null,
  xKey: null,
  yKeys: {},
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
  wl: null,
  cu: null,
}

export default {

  /** STATE ------------------------------------------------------------------ */
  ...stateDefaults,

  /** unique state of each chart type */
  bar: { ...widgetDefaults.bar },
  line: { ...widgetDefaults.line },
  pie: { ...widgetDefaults.pie },
  scatter: { ...widgetDefaults.scatter },

  /** COMPUTED STATE ------------------------------------------------------------ */

  config: computed(
    [
      (state) => state.title,
      (state) => state.type,
      (state) => state.filters,
      (state) => state.yKeys,
      (state) => state.dataSource.type,
      (state) => state.dataSource.id,
      (state) => state[state.type],
      (state) => state.isReady,
    ],
    (
      title,
      type,
      filters,
      yKeys,
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
          yKeys,
          dataSource: {
            type: dataSourceType,
            id: dataSourceID,
          },
          options,
        }
        : undefined
    )),

  /** checks if all initial states have been filled */
  isReady: computed(
    [
      (state) => state.rows,
      (state) => state.columns,
      (state) => state.type,
      (state) => state.groupBy,
      (state) => state.yKeys,
    ],
    (
      rows,
      columns,
      type,
      groupBy,
      yKeys,
    ) => (
      Boolean(type && columns.length && rows.length && yKeys)
    )),

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
      // console.dir(nestedPayload)
      // Object.entries(nestedPayload).forEach(([deepNestKey, deepNestedPayload]) => {
      //   // console.log([deepNestKey, deepNestedPayload])
      //   // console.log(Object.getPrototypeOf(nestedPayload) === Object.prototype)
      // })

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
