import { computed, action, thunk } from 'easy-peasy'
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

const stateDefaults = {
  id: null,
  title: '',
  type: '',
  filters: {},
  group: false,
  groupKey: null,
  indexKey: null,
  valueKeys: [],
  options: {},
  genericOptions: {
    subPlots: false,
  },
  dataSource: {
    type: null,
    id: null,
  },
  rows: [],
  columns: [],
  stringColumns: [],
  numericColumns: [],
  ui: {
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
  },
  wl: null,
  cu: null,
}

export default {

  /** STATE ------------------------------------------------------------------ */
  ...stateDefaults,

  /** COMPUTED STATE ------------------------------------------------------------ */

  config: computed(
    [
      (state) => state.title,
      (state) => state.type,
      (state) => state.filters,
      (state) => state.group,
      (state) => state.groupKey,
      (state) => state.indexKey,
      (state) => state.valueKeys,
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
      valueKeys,
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
          valueKeys,
          group,
          groupKey,
          indexKey,
          options,
          genericOptions,
          dataSource: { type: dataSourceType, id: dataSourceID },
        }
        : undefined
    )),

  /** checks if all initial states have been filled */
  isReady: computed(
    [
      (state) => state.rows,
      (state) => state.columns,
      (state) => state.type,
      (state) => state.valueKeys,
      (state) => state.indexKey,
      (state) => state.groupKey,
    ],
    (
      rows,
      columns,
      type,
      valueKeys,
      indexKey,
      groupKey,
    ) => (
      Boolean(type && columns.length && rows.length && (indexKey || groupKey) && valueKeys.length)
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
            showFilterControls: true,
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
  nestedUpdate: action((state, payload) => {
    return Object.entries(payload).reduce((acc, [nestKey, nestedPayload]) => {
      acc[nestKey] = { ...acc[nestKey], ...nestedPayload }
      return acc
    }, state)
  }),

  // reset all shared and unique states except data source and data ID
  resetWidget: thunk((actions, payload, { getState }) => {
    const { type, ui, dataSource } = getState()
    actions.update({ ...stateDefaults, ui, dataSource })
    actions.nestedUpdate({ options: widgetDefaults[type] })
  }),
}
