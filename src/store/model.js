import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { computed, action, thunk, thunkOn } from 'easy-peasy'
import { cleanUp } from '../util/string-manipulation'
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
}

const stateDefaults = [
  { key: 'id', defaultValue: null, resettable: false },
  { key: 'title', defaultValue: '', resettable: false },
  { key: 'type', defaultValue: '', resettable: false },
  { key: 'filters', defaultValue: {}, resettable: true },
  { key: 'group', defaultValue: false, resettable: true },
  { key: 'groups', defaultValue: [], resettable: true },
  { key: 'groupKey', defaultValue: null, resettable: true },
  { key: 'indexKey', defaultValue: null, resettable: true },
  { key: 'valueKeys', defaultValue: [], resettable: true },
  { key: 'renderableValueKeys', defaultValue: [], resettable: true },
  { key: 'options', defaultValue: {}, resettable: true },
  {
    key: 'genericOptions', defaultValue: {
      groupByValue: false,
      subPlots: false,
      size: 0.8,
      titlePosition: [0, 0],
      baseColor: getTailwindConfigColor('primary-500'),
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
  { key: 'dataHasVariance', defaultValue: true, resettable: false },
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
      showToast: false,
      toastConfig: {},
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
      (state) => state.formattedColumnNames,
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
      formattedColumnNames,
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
          ...(groupKey && { groupKeyTitle: formattedColumnNames[groupKey] } || groupKey),
          ...(indexKey && { indexKeyTitle: formattedColumnNames[indexKey] } || indexKey),
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
      (state) => state.formattedColumnNames,
    ],
    (
      valueKeys,
      group,
      formattedColumnNames,
    ) => (
      valueKeys
        .filter(({ key, agg }) => key && (agg || !group)
        )
        .map(({ key, agg, ...rest }) => ({
          key,
          title: `${formattedColumnNames[key]}${agg ? ` (${agg})` : ''}` || key,
          ...(agg && { agg }),
          ...rest,
        })
        )
    )
  ),

  formattedColumnNames: computed(
    [
      (state) => state.columns,
    ],
    (
      columns
    ) => (
      Object.fromEntries(columns.map(({ name }) => [name, cleanUp(name)]))
    )
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

  dev: computed([], () => (process.env?.NODE_ENV ?? 'development' === 'development')),

  /** ACTIONS ------------------------------------------------------------------ */

  toast: thunk(async (actions, payload) => {
    actions.nestedUpdate({
      ui: {
        toastConfig: payload,
        showToast: true,
      },
    })
    setTimeout(() => actions.nestedUpdate({ ui: { showToast: false } }), 3000)
  }),

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
