import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { computed, action, thunk, thunkOn } from 'easy-peasy'

import types from '../constants/types'
import typeInfo from '../constants/type-info'
import { COLOR_REPRESENTATIONS, DEFAULT_PRESET_COLORS } from '../constants/color'
import { cleanUp } from '../util/string-manipulation'
import { requestConfig, requestData } from '../util/fetch'
import { geoKeyHasCoordinates } from '../util'
import { MAP_GEO_KEYS, GEO_KEY_TYPES } from '../constants/map'
import { getKeyFormatFunction } from '../util/data-format-functions'


const stateDefaults = [
  { key: 'id', defaultValue: null, resettable: false },
  { key: 'title', defaultValue: '', resettable: false },
  { key: 'type', defaultValue: '', resettable: true },
  { key: 'filters', defaultValue: [], resettable: true },
  { key: 'group', defaultValue: false, resettable: true },
  { key: 'groupFilter', defaultValue: [], resettable: true },
  { key: 'groups', defaultValue: [], resettable: true },
  { key: 'groupKey', defaultValue: null, resettable: true },
  { key: 'mapGroupKey', defaultValue: null, resettable: true },
  { key: 'indexKey', defaultValue: null, resettable: true },
  { key: 'valueKeys', defaultValue: [], resettable: true },
  { key: 'mapValueKeys', defaultValue: [], resettable: true },
  { key: 'uniqueOptions', defaultValue: {}, resettable: true },
  {
    key: 'genericOptions', defaultValue: {
      showWidgetTitle: false,
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
  { key: 'percentageMode', defaultValue: false, resettable: true },
  { key: 'presetColors', defaultValue: DEFAULT_PRESET_COLORS, resettable: true },
  {
    key: 'ui',
    defaultValue: {
      mode: null,
      showTable: false,
      tableShowsRawData: true,
      showWidgetControls: true,
      showFilterControls: false,
      showDataSourceControls: false,
      staticData: false,
      dataSourceLoading: false,
      dataSourceError: null,
      dataSourceName: null,
      colorRepresentation: COLOR_REPRESENTATIONS[0],
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
      (state) => state.groupFilter,
      (state) => state.group,
      (state) => state.groupKey,
      (state) => state.mapGroupKey,
      (state) => state.indexKey,
      (state) => state.renderableValueKeys,
      (state) => state.formatDataFunctions,
      (state) => state.genericOptions,
      (state) => state.uniqueOptions,
      (state) => state.isReady,
      (state) => state.formattedColumnNames,
      (state) => state.dataSource,
    ],
    (
      title,
      type,
      filters,
      groupFilter,
      group,
      groupKey,
      mapGroupKey,
      indexKey,
      renderableValueKeys,
      formatDataFunctions,
      genericOptions,
      uniqueOptions,
      isReady,
      formattedColumnNames,
      { type: dataSourceType, id: dataSourceID },
    ) => (
      isReady
        ? {
          title,
          type,
          filters,
          groupFilter,
          valueKeys: type !== types.MAP ? renderableValueKeys : [],
          mapValueKeys: type === types.MAP ? renderableValueKeys : [],
          formatDataFunctions,
          group,
          groupKey,
          mapGroupKey,
          indexKey,
          ...(groupKey && { groupKeyTitle: formattedColumnNames[groupKey] } || groupKey),
          ...(mapGroupKey && { mapGroupKeyTitle: formattedColumnNames[mapGroupKey] } || mapGroupKey),
          ...(indexKey && { indexKeyTitle: formattedColumnNames[indexKey] } || indexKey),
          uniqueOptions,
          genericOptions,
          dataSource: { type: dataSourceType, id: dataSourceID },
        }
        : undefined
    )),

  columnsAnalysis: computed(
    [
      (state) => state.columns,
      (state) => state.rows,
    ],
    (
      columns,
      rows
    ) => (
      columns.reduce((acc, { name, category }) => {
        const data = rows.map(r => r[name])
        acc[name] = {
          category,
          ...(category === 'Numeric' && {
            min: Math.min.apply(null, data),
            max: Math.max.apply(null, data),
          }),
        }
        return acc
      }, {})
    )
  ),

  numericColumns: computed(
    [(state) => state.columns],
    (columns) => columns.filter(({ category }) => category === 'Numeric').map(({ name }) => name)
  ),

  stringColumns: computed(
    [(state) => state.columns],
    (columns) => columns.filter(({ category }) => category === 'String').map(({ name }) => name)
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
      // this allows grouping by FSA when postal code key is present in the data object but no FSA
      if (dataGeoKeys.some(key => GEO_KEY_TYPES.postalcode.includes(key)) &&
        !dataGeoKeys.some(key => GEO_KEY_TYPES.fsa.includes(key))) {
        // add an artificial geo_ca_fsa key to the validMapGroupKeys if we have postalcode key but no FSA
        dataGeoKeys.push('geo_ca_fsa')
      }
      return dataGeoKeys
    }
  ),

  // determines to use postal code geo key to aggregate by FSA
  groupFSAByPC: computed(
    [
      (state) => state.mapGroupKey,
      (state) => state.columns,
    ],
    (mapGroupKey, columns) => {
      return GEO_KEY_TYPES.fsa.includes(mapGroupKey) && !columns.map(({ name }) => name).includes(mapGroupKey)
    }
  ),

  renderableValueKeys: computed(
    [
      (state) => state.valueKeys,
      (state) => state.mapValueKeys,
      (state) => state.group,
      (state) => state.type,
      (state) => state.dataHasVariance,
      (state) => state.formattedColumnNames,
    ],
    (
      valueKeys,
      mapValueKeys,
      group,
      type,
      dataHasVariance,
      formattedColumnNames
    ) => (
      (type === types.MAP ? mapValueKeys : valueKeys)
        .filter(({ key, agg }) => key && (agg || !dataHasVariance || !group))
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
      (state) => state.groupFSAByPC,
    ],
    (
      columns,
      groupFSAByPC,
    ) => (
      Object.fromEntries(columns.map(({ name }) => [name, cleanUp(name)])
        .concat(groupFSAByPC ? [['geo_ca_fsa', cleanUp('geo_ca_fsa')]] : []))
    )
  ),

  formatDataFunctions: computed(
    [(state) => state.renderableValueKeys],
    (renderableValueKeys) => Object.fromEntries(renderableValueKeys.map(({ key, title }) => (
      [title, getKeyFormatFunction(key)]
    )))
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
      (state) => state.transformedData,
    ],
    (
      rows,
      columns,
      type,
      renderableValueKeys,
      indexKey,
      groupKey,
      mapGroupKey,
      transformedData,
    ) => (
      Boolean(type && columns.length && rows.length && transformedData?.length &&
        (
          type === types.MAP
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

  dev: computed([], () => ((process?.env?.NODE_ENV || 'development') === 'development')),

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
            if (stateDefaults.find(({ key }) => key === k)) {
              actions.nestedUpdate({ [k]: v })
            }
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
    const isReload = isReady
    requestData(dataSource.type, dataSource.id)
      .then(data => {
        const { results: rows, columns, whitelabelID, customerID, views: [{ name }] } = data
        actions.update({
          rows,
          columns,
          wl: whitelabelID, // only used for wl-cu-selector
          cu: customerID, // only used for wl-cu-selector
        })
        actions.nestedUpdate({
          ui: {
            showWidgetControls: true,
            dataSourceName: name,
            dataSourceError: null,
          },
        })
        actions.nestedUpdate({ ui: { dataSourceLoading: false } })
        if (isReload) {
          actions.toast({
            title: `${name} reloaded successfully`,
            color: 'success',
          })
        }
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

  // reset a portion of the state
  resetValue: action((state, payload) => (
    Object.keys(payload)
      .reduce((acc, k) => {
        acc[k] = stateDefaults.find(({ key }) => key === k).defaultValue
        return acc
      }, state)
  )),

  // reset all shared and unique states except data source and data ID
  resetWidget: action((state) => ({
    ...state,
    ...Object.fromEntries(stateDefaults.filter(s => s.resettable)
      .map(({ key, defaultValue }) => ([key, defaultValue]))),
    uniqueOptions: Object.fromEntries(
      Object.entries(typeInfo[state.type].uniqueOptions)
        .map(([k, { defaultValue }]) => [k, defaultValue])
    ),
    // map widget doesn't have a switch to change group state, so we have to keep it true here
    group: state.type === types.MAP ? true : state.group,
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
