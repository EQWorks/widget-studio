import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { computed, action, thunk, thunkOn } from 'easy-peasy'

import { cleanUp } from '../util/string-manipulation'
import { requestConfig, requestData } from '../util/fetch'
import { DEFAULT_PRESET_COLORS } from '../constants/viz-options'
import { geoKeyHasCoordinates } from '../util'
import { MAP_GEO_KEYS, GEO_KEY_TYPES } from '../constants/map'


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
  { key: 'groups', defaultValue: [], resettable: true },
  { key: 'groupKey', defaultValue: null, resettable: true },
  { key: 'mapGroupKey', defaultValue: null, resettable: true },
  { key: 'indexKey', defaultValue: null, resettable: true },
  { key: 'valueKeys', defaultValue: [], resettable: true },
  { key: 'mapValueKeys', defaultValue: [], resettable: true },
  { key: 'renderableValueKeys', defaultValue: [], resettable: true },
  { key: 'options', defaultValue: {}, resettable: true },
  {
    key: 'genericOptions', defaultValue: {
      groupByValue: false,
      showLegend: true,
      subPlots: false,
      size: 0.8,
      titlePosition: [0, 0],
      legendPosition: [1, 0],
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
  { key: 'transformedData', defaultValue: [], resettable: false },
  { key: 'dataHasVariance', defaultValue: true, resettable: false },
  { key: 'stringColumns', defaultValue: [], resettable: false },
  { key: 'numericColumns', defaultValue: [], resettable: false },
  { key: 'presetColors', defaultValue: DEFAULT_PRESET_COLORS, resettable: true },
  { key: 'validMapGroupKeys', defaultValue: [], resettable: false },
  // determines to use postal code geo key to aggregate by FSA
  { key: 'groupFSAbyPC', defaultValue: false, resettable: false },
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
      (state) => state.mapGroupKey,
      (state) => state.indexKey,
      (state) => state.renderableValueKeys,
      (state) => state.mapValueKeys,
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
      mapGroupKey,
      indexKey,
      renderableValueKeys,
      mapValueKeys,
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
          valueKeys: type !== 'map' ? renderableValueKeys : [],
          mapValueKeys: type === 'map' ? renderableValueKeys : [],
          group,
          groupKey,
          mapGroupKey,
          indexKey,
          ...(groupKey && { groupKeyTitle: formattedColumnNames[groupKey] } || groupKey),
          ...(indexKey && { indexKeyTitle: formattedColumnNames[indexKey] } || indexKey),
          options,
          genericOptions,
          dataSource: { type: dataSourceType, id: dataSourceID },
        }
        : undefined
    )),

  numericColumns: computed(
    [(state) => state.columns],
    (columns) => (
      columns.filter(({ category }) => category === 'Numeric').map(({ name }) => name)
    )
  ),

  stringColumns: computed(
    [(state) => state.columns],
    (columns) => (
      columns.filter(({ category }) => category === 'String').map(({ name }) => name)
    )
  ),

  validMapGroupKeys: computed(
    [
      (state) => state.columns,
      (state) => state.numericColumns,
    ],
    (columns, numericColumns) => {
      const dataGeoKeys = columns.filter(({ name }) =>
        MAP_GEO_KEYS.includes(name) && geoKeyHasCoordinates(name, numericColumns))
        .map(({ name }) => name)
      // BEFORE MERGING - replace this with the commented lines below; this is just for demonstration
      // this allows grouping by FSA when postal code key is present in the data object but no FSA
      if (dataGeoKeys.some(key => GEO_KEY_TYPES.postalcode.includes(key))) {
      // if (dataGeoKeys.some(key => GEO_KEY_TYPES.postalcode.includes(key)) &&
      // !dataGeoKeys.some(key => GEO_KEY_TYPES.fsa.includes(key))) {
        // add an artificial geo_ca_fsa key to the validMapGroupKeys if we have postalcode key but no FSA
        dataGeoKeys.push('geo_ca_fsa')
      }
      return dataGeoKeys
    }
  ),

  groupFSAByPC: computed(
    [
      (state) => state.mapGroupKey,
      (state) => state.columns,
    ],
    (mapGroupKey, columns) => {
      return  GEO_KEY_TYPES.fsa.includes(mapGroupKey) && !columns.map(({ name }) => name).includes(mapGroupKey)
    }
  ),

  renderableValueKeys: computed(
    [
      (state) => state.valueKeys,
      (state) => state.mapValueKeys,
      (state) => state.group,
      (state) => state.type,
      (state) => state.zeroVarianceColumns,
      (state) => state.formattedColumnNames,
    ],
    (
      valueKeys,
      mapValueKeys,
      group,
      type,
      zeroVarianceColumns,
      formattedColumnNames
    ) => (
      type === 'map'
        ? mapValueKeys.filter(({ key, agg }) => key && (agg || zeroVarianceColumns.includes(key)))
        : valueKeys
          .filter(({ key, agg }) => key && (agg || !group))
          .map(({ key, agg, ...rest }) => ({
            key,
            title: `${formattedColumnNames[key]}${agg ? ` (${agg})` : ''}` || key,
            ...(agg && { agg }),
            ...rest,
          }))
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
      (state) => state.mapGroupKey,
    ],
    (
      rows,
      columns,
      type,
      renderableValueKeys,
      indexKey,
      groupKey,
      mapGroupKey,
    ) => (
      Boolean(type && columns.length && rows.length &&
        (
          type === 'map'
            ? renderableValueKeys.length && mapGroupKey
            : renderableValueKeys.length && (indexKey || groupKey)
        )
      )
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

  dev: computed([], () => ((process.env?.NODE_ENV || 'development') === 'development')),

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
      .then(({ dataSource, ...config }) => {
        Object.entries(config)
          .filter(([, v]) => v !== null && !Array.isArray(v) && typeof v === 'object')
          .forEach(([k, v]) => {
            actions.nestedUpdate({ [k]: v })
            delete config[k]
          })
        actions.update(config)
        actions.loadData(dataSource)
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

  loadData: thunk(async (actions, dataSource, { getState }) => {
    actions.nestedUpdate({
      ui: {
        showDataSourceControls: false,
        dataSourceLoading: true,
      },
      dataSource,
    })
    const { isReady } = getState()
    requestData(dataSource.type, dataSource.id)
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
    ...Object.fromEntries(stateDefaults.filter(s => s.resettable)
      .map(({ key, defaultValue }) => ([key, defaultValue]))),
    options: widgetDefaults[state.type],
    // map widget doesn't have a switch to change group state, so we have to keep it true here
    group: state.type === 'map' ? true : state.group,
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
