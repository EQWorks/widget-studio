import { computed, action, thunk, thunkOn } from 'easy-peasy'
import { requestConfig, requestData } from '../util/fetch'


const widgetDefaults = {
  bar: {
    stacked: false,
    spline: false,
    showTicks: true,
  },
  line: {
    showTicks: true,
    spline: false,
  },
  pie: {
    donut: false,
    showPercentage: true,
    showLegend: true,
  },
  scatter: {
    showTicks: true,
    showLines: false,
  },
  map: {
    showTooltip: true,
    showLegend: true,
  },
}

const stateDefaults = [
  { key: 'id', defaultValue: null, resettable: false },
  { key: 'title', defaultValue: '', resettable: false },
  { key: 'type', defaultValue: '', resettable: false },
  { key: 'filters', defaultValue: {}, resettable: true },
  { key: 'group', defaultValue: false, resettable: true },
  { key: 'groupKey', defaultValue: null, resettable: true },
  { key: 'indexKey', defaultValue: null, resettable: true },
  { key: 'valueKeys', defaultValue: [], resettable: true },
  { key: 'renderableValueKeys', defaultValue: [], resettable: true },
  { key: 'options', defaultValue: {}, resettable: true },
  {
    key: 'genericOptions', defaultValue: {
      subPlots: false,
    }, resettable: true,
  },
  {
    key: 'dataSource', defaultValue: {
      type: null,
      id: null,
    },
    resettable: false,
  },
  { key: 'rows', defaultValue: [], resettable: false },
  { key: 'columns', defaultValue: [], resettable: false },
  { key: 'zeroVarianceColumns', defaultValue: [], resettable: false },
  { key: 'stringColumns', defaultValue: [], resettable: false },
  { key: 'numericColumns', defaultValue: [], resettable: false },
  {
    key: 'ui',
    defaultValue: {
      mode: null,
      showTable: false,
      showWidgetControls: true,
      showFilterControls: false,
      showDataSourceControls: false,
      staticData: false,
      dataSourceLoading: false,
      dataSourceError: null,
      dataSourceName: null,
      editingTitle: false,
      allowReset: true,
      recentReset: false,
      controlsWidth: null,
    },
    resettable: false,
  },
  { key: 'wl', defaultValue: null, resettable: false },
  { key: 'cu', defaultValue: null, resettable: false },
]

export default {

  /** STATE ------------------------------------------------------------------ */
  ...Object.fromEntries(stateDefaults.map(({ key, defaultValue }) => ([key, defaultValue]))),

  /** COMPUTED STATE ------------------------------------------------------------ */

  config: computed(
    [
      (state) => state.title,
      (state) => state.type,
      (state) => state.filters,
      (state) => state.group,
      (state) => state.groupKey,
      (state) => state.indexKey,
      (state) => state.renderableValueKeys,
      (state) => state.genericOptions,
      (state) => state.options,
      (state) => state.isReady,
      (state) => state.dataSource,
    ],
    (
      title,
      type,
      filters,
      group,
      groupKey,
      indexKey,
      renderableValueKeys,
      genericOptions,
      options,
      isReady,
      { type: dataSourceType, id: dataSourceID },
    ) => (
      isReady
        ? {
          title,
          type,
          filters,
          valueKeys: renderableValueKeys,
          group,
          groupKey,
          indexKey,
          options,
          genericOptions,
          dataSource: { type: dataSourceType, id: dataSourceID },
        }
        : undefined
    )),

  renderableValueKeys: computed(
    [
      (state) => state.valueKeys,
      (state) => state.group,
    ],
    (
      valueKeys,
      group
    ) => (
      valueKeys.filter(({ key, agg }) => key && (agg || !group)
      ))
  ),

  /** checks if all initial states have been filled */
  isReady: computed(
    [
      (state) => state.rows,
      (state) => state.columns,
      (state) => state.type,
      (state) => state.renderableValueKeys,
      (state) => state.indexKey,
      (state) => state.groupKey,
    ],
    (
      rows,
      columns,
      type,
      renderableValueKeys,
      indexKey,
      groupKey,
    ) => (
      Boolean(type && columns.length && rows.length && (indexKey || groupKey) && renderableValueKeys.length)
    )),


  dataReady: computed(
    [
      (state) => state.ui.dataSourceError,
      (state) => state.ui.dataSourceLoading,
      (state) => state.dataSource.type,
      (state) => state.dataSource.id,
    ],
    (
      dataSourceError,
      dataSourceLoading,
      dataSourceType,
      dataSourceID,
    ) => (
      Boolean(dataSourceType && dataSourceID && !dataSourceLoading && !dataSourceError)
    )),

  /** ACTIONS ------------------------------------------------------------------ */

  loadConfig: thunk(async (actions, payload) => {

    actions.nestedUpdate({
      ui: {
        showDataSourceControls: false,
        dataSourceLoading: true,
      },
    })
    requestConfig(payload)
      .then(config => {
        actions.update(config)
        actions.loadData(config.dataSource)
      })
      .catch(err => {
        actions.nestedUpdate({
          ui: {
            error: err,
            dataSourceLoading: false,
          },
        })
      })
  }),

  loadData: thunk(async (actions, { type, id }, { getState }) => {

    actions.nestedUpdate({
      ui: {
        showDataSourceControls: false,
        dataSourceLoading: true,
      },
    })
    const { isReady } = getState()
    requestData(type, id)
      .then(data => {
        if (isReady) {
          actions.resetWidget()
        }
        const { results: rows, columns, whitelabelID, customerID, views } = data
        actions.update({
          rows,
          columns,
          wl: whitelabelID, // only used for wl-cu-selector
          cu: customerID, // only used for wl-cu-selector
        })
        actions.nestedUpdate({
          ui: {
            showWidgetControls: true,
            dataSourceName: views[0].name,
            dataSourceError: null,
          },
        })
        actions.nestedUpdate({ ui: { dataSourceLoading: false } })
      })
      .catch(err => {
        actions.nestedUpdate({
          ui: {
            dataSourceError: err,
            dataSourceLoading: false,
          },
        })
      })
  }),

  // update the store state
  update: action((state, payload) => ({ ...state, ...payload })),

  // perform a nested update on the store state
  nestedUpdate: action((state, payload) => (
    Object.entries(payload).reduce((acc, [nestKey, nestedPayload]) => {
      acc[nestKey] = { ...acc[nestKey], ...nestedPayload }
      return acc
    }, state)
  )),

  // reset all shared and unique states except data source and data ID
  resetWidget: action((state) => ({
    ...state,
    options: widgetDefaults[state.type],
    ...Object.fromEntries(stateDefaults.filter(s => s.resettable)
      .map(({ key, defaultValue }) => ([key, defaultValue]))),
  })),

  // on reset, set a 5 second timer during which reset cannot be re-enabled
  onReset: thunkOn((actions) => actions.resetWidget,
    (actions) => {
      setTimeout(() => actions.setRecentReset(false), 1000)
      actions.setAllowReset(false)
      actions.setRecentReset(true)
    }),

  // re-enable reset whenever state is changed
  onUpdate: thunkOn((actions) => actions.update,
    (actions) => actions.setAllowReset(true)),
  onNestedUpdate: thunkOn((actions) => actions.nestedUpdate,
    (actions) => actions.setAllowReset(true)),

  // re-enable reset whenever state is changed, outside of update() or nestedUpdate()
  setRecentReset: action((state, payload) => ({ ...state, ui: { ...state.ui, recentReset: payload } })),

  // set the ui.allowReset state outside of update() or nestedUpdate()
  setAllowReset: action((state, payload) => (
    !state.ui?.recentReset
      ? { ...state, ui: { ...state.ui, allowReset: payload } }
      : state
  )),
}
