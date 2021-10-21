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
  map: {
    showTooltip: true,
    showLegend: true,
  },
}

const stateDefaults = {
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
  ui: {
    mode: null,
    showTable: false,
    showWidgetControls: false,
    showFilterControls: false,
    showDataSourceControls: false,
    staticData: false,
    dataSourceLoading: false,
    dataSourceError: null,
    dataSourceName: null,
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
    ],
    (
      rows,
      columns,
      type,
      valueKeys,
    ) => (
      Boolean(type && columns.length && rows.length && valueKeys.length)
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
    const config = await requestConfig(payload)
      .catch((dataSourceError) => {
        actions.nestedUpdate({
          ui: {
            error: dataSourceError,
            dataSourceLoading: false,
          },
        })
      })
    actions.update(config)
    actions.loadData(config.dataSource)
  }),

  loadData: thunk(async (actions, { type, id }, { getState }) => {

    const { isReady, staticData } = getState()
    const data = await requestData(type, id)

    if (type && id) {
      if (isReady) {
        actions.reset()
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
    } else {
      actions.nestedUpdate({ ui: { showDataSourceControls: !staticData } })
    }
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
  reset: thunk((actions, payload, { getState }) => {
    const type = getState().type
    actions.update({ ...stateDefaults })
    actions.nestedUpdate({ options: widgetDefaults[type] })
  }),
}
