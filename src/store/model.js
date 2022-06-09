import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { computed, action, thunk, thunkOn } from 'easy-peasy'

import types from '../constants/types'
import typeInfo from '../constants/type-info'
import { COLOR_REPRESENTATIONS, DEFAULT_PRESET_COLORS } from '../constants/color'
import { cleanUp, truncateString } from '../util/string-manipulation'
import { createWidget, saveWidget, getWidget, localGetWidget, requestData } from '../util/api'
import { geoKeyHasCoordinates } from '../util'
import {
  MAP_LAYERS,
  MAP_GEO_KEYS,
  GEO_KEY_TYPES,
  MAP_LAYER_GEO_KEYS,
  COORD_KEYS,
  GEO_KEY_TYPE_NAMES,
} from '../constants/map'
import { getKeyFormatFunction } from '../util/data-format-functions'
import { deepMerge } from './util'
import { dateAggregations } from '../constants/time'
import { columnTypes } from '../constants/columns'
import { columnInference } from '../util/columns'
import { mapDataIsValid } from '../util/map_data_validation'
import { EXPORT_TYPES } from '../constants/export'
import { screenshot } from '../util/export'
import { dataSourceTypes } from '../constants/data-source'


const MAX_UNDO_STEPS = 10


const stateDefaults = [
  { key: 'id', defaultValue: null, resettable: false },
  { key: 'title', defaultValue: 'Untitled Widget', resettable: false },
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
    key: 'meta', defaultValue: {
      updatedAt: null,
      createdAt: null,
    }, resettable: false,
  },
  {
    key: 'genericOptions', defaultValue: {
      showWidgetTitle: false,
      groupByValue: false,
      showLegend: true,
      showTooltip: true,
      showAxisTitles: true,
      showSubPlotTitles: true,
      showLabels: false,
      mapHideSourceLayer: false,
      mapHideTargetLayer: false,
      mapHideArcLayer: false,
      subPlots: false,
      size: 0.8,
      titlePosition: [0, 0],
      legendPosition: [1, 0],
      legendSize: 'Small',
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
  // TO DELETE or change in the future when we implement data tree selection
  { key: 'saveWithInsightsData', defaultValue: false, resettable: false },
  { key: 'reportType', defaultValue: null, resettable: true },
  { key: 'percentageMode', defaultValue: false, resettable: true },
  { key: 'presetColors', defaultValue: DEFAULT_PRESET_COLORS, resettable: true },
  {
    key: 'ui',
    defaultValue: {
      mode: null,
      baseMode: null,
      showTable: false,
      maximizeTable: false,
      tableShowsRawData: true,
      showWidgetControls: true,
      showFilterControls: false,
      staticData: false,
      configLoading: false,
      dataSourceLoading: false,
      dataSourceError: null,
      dataSourceName: null,
      colorRepresentation: COLOR_REPRESENTATIONS[0],
      allowReset: true,
      recentReset: false,
      showToast: false,
      toastConfig: {},
      exportType: EXPORT_TYPES[0],
      screenshotRef: null,
      image: null,
    },
    resettable: false,
  },
  { key: 'wl', defaultValue: null, resettable: false },
  { key: 'cu', defaultValue: null, resettable: false },
  { key: 'undoQueue', defaultValue: [], resettable: false },
  { key: 'redoQueue', defaultValue: [], resettable: false },
  { key: 'ignoreUndo', defaultValue: false, resettable: false },
  { key: 'unsavedChanges', defaultValue: false, resettable: false },
  { key: 'dateAggregation', defaultValue: dateAggregations.NONE, resettable: true },
  { key: 'formatDataKey', defaultValue: (label) => truncateString(label, 30), resettable: false },
]

export default {

  /** STATE ------------------------------------------------------------------ */
  ...Object.fromEntries(stateDefaults.map(({ key, defaultValue }) => ([key, defaultValue]))),

  /** COMPUTED STATE ------------------------------------------------------------ */

  tentativeConfig: computed(
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
      (state) => state.formatDataKey,
      (state) => state.formatDataFunctions,
      (state) => state.genericOptions,
      (state) => state.uniqueOptions,
      (state) => state.isReady,
      (state) => state.formattedColumnNames,
      (state) => state.dataSource,
      (state) => state.percentageMode,
      (state) => state.presetColors,
      (state) => state.dateAggregation,
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
      formatDataKey,
      formatDataFunctions,
      genericOptions,
      uniqueOptions,
      isReady,
      formattedColumnNames,
      { type: dataSourceType, id: dataSourceID },
      percentageMode,
      presetColors,
      dateAggregation,
    ) => ({
      title,
      type,
      filters: filters.filter(({ key, filter }) => key && filter),
      groupFilter,
      valueKeys: type !== types.MAP ? renderableValueKeys : [],
      mapValueKeys: type === types.MAP ? renderableValueKeys : [],
      formatDataKey,
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
      percentageMode,
      presetColors,
      dateAggregation,
    })),

  config: computed(
    [
      (state) => state.tentativeConfig,
      (state) => state.isReady,
    ],
    (
      tentativeConfig,
      isReady
    ) => (
      isReady ? tentativeConfig : undefined
    )
  ),

  columnsAnalysis: computed(
    [
      (state) => state.columns,
      (state) => state.rows,
    ],
    (
      columns,
      rows
    ) => (
      columns.reduce((acc, { name }) => {
        const data = rows.map(r => r[name])
        acc[name] = columnInference(data, name)
        if (acc[name].isNumeric) {
          const numericData = acc[name].normalized || data
          acc[name].min = Math.min.apply(null, numericData)
          acc[name].max = Math.max.apply(null, numericData)
        }
        return acc
      }, {})
    )
  ),

  domain: computed(
    [
      (state) => state.group,
      (state) => state.type,
      (state) => state.mapGroupKey,
      (state) => state.indexKey,
      (state) => state.groupKey,
      (state) => state.dataIsXWIReport,
    ],
    (
      group,
      type,
      mapGroupKey,
      indexKey,
      groupKey,
      dataIsXWIReport,
    ) => {
      let res = {}
      if (type === types.MAP && !dataIsXWIReport) {
        res = { mapGroupKey }
      } else if (!group) {
        res = { indexKey }
      } else {
        res = { groupKey }
      }
      const [k, v] = Object.entries(res)[0]
      return { key: k, value: v }
    }
  ),

  numericColumns: computed(
    [(state) => state.columnsAnalysis],
    (columnsAnalysis) => Object.entries(columnsAnalysis)
      .filter(([, { isNumeric }]) => isNumeric)
      .map(([name]) => name)
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

  mapLayer: computed(
    [
      (state) => state.mapGroupKey,
    ],
    (mapGroupKey) =>
      Object.keys(MAP_LAYERS).find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
  ),

  // determines to use postal code geo key to aggregate by FSA
  groupFSAByPC: computed(
    [
      (state) => state.mapGroupKey,
      (state) => state.columns,
    ],
    (mapGroupKey, columns) => GEO_KEY_TYPES.fsa.includes(mapGroupKey) &&
      !columns.map(({ name }) => name).includes(mapGroupKey)
  ),

  domainIsDate: computed(
    [
      (state) => state.domain,
      (state) => state.columnsAnalysis,
    ],
    (domain, columnsAnalysis) => (
      columnsAnalysis[domain.value]?.category === columnTypes.DATE
    )
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
          ...rest,
          key,
          title: `${formattedColumnNames[key]}${group && agg ? ` (${agg})` : ''}` || key,
          ...(agg && { agg }),
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

  isLoading: computed(
    [
      (state) => state.ui.configLoading,
      (state) => state.ui.dataSourceLoading,
    ],
    (
      configLoading,
      dataSourceLoading
    ) => (
      configLoading || dataSourceLoading
    )
  ),

  /** checks if all initial states have been filled */
  isReady: computed(
    [
      (state) => state.rows,
      (state) => state.columns,
      (state) => state.type,
      (state) => state.renderableValueKeys,
      (state) => state.domain,
      (state) => state.transformedData,
      (state) => state.mapDataReady,
      (state) => state.dataIsXWIReport,
      (state) => state.isLoading,
    ],
    (
      rows,
      columns,
      type,
      renderableValueKeys,
      domain,
      transformedData,
      mapDataReady,
      dataIsXWIReport,
      isLoading,
    ) => {
      const isXWIReportMap = Boolean(type && type === types.MAP && dataIsXWIReport &&
        columns.length && rows.length && transformedData?.arcData?.length)
      const mapChartReady = type && (type !== types.MAP || mapDataReady)
      return isXWIReportMap ||
        Boolean(mapChartReady && !isLoading && columns.length && rows.length &&
          transformedData?.length && renderableValueKeys.length && domain.value)
    }),

  dataIsXWIReport: computed(
    [
      (state) => state.columnsAnalysis,
    ],
    (
      columnsAnalysis,
    ) => {
      const dataKeys = Object.keys(columnsAnalysis) || []
      const findCoord = coordArray => dataKeys?.find(key => coordArray.includes(key))
      const sourceLon = findCoord(COORD_KEYS.longitude)
      const sourceLat = findCoord(COORD_KEYS.latitude)
      const targetLon = findCoord(COORD_KEYS.targetLon)
      const targetLat = findCoord(COORD_KEYS.targetLat)
      const sourcePOIid = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.scatterplot.includes(key))
      const targetPOIid = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.targetScatterplot.includes(key))
      return Boolean(sourceLon && sourceLat && targetLon && targetLat &&
        sourcePOIid && targetPOIid)
    }),

  /** checks if transformedData is in sync with the map layer, domain, & renderableValueKeys */
  mapDataReady: computed(
    [
      (state) => state.type,
      (state) => state.renderableValueKeys,
      (state) => state.domain,
      (state) => state.transformedData,
      (state) => state.formattedColumnNames,
      (state) => state.mapLayer,
      (state) => state.dataIsXWIReport,
    ],
    (
      type,
      renderableValueKeys,
      domain,
      transformedData,
      formattedColumnNames,
      mapLayer,
      dataIsXWIReport,
    ) => {
      if (type === types.MAP && !dataIsXWIReport && transformedData?.length) {
        const dataSample = transformedData[0] || {}
        const dataKeys = Object.keys(dataSample)
        const mapGroupKeyTitle = formattedColumnNames[domain?.value] || null
        const dataIsValid = mapDataIsValid({ dataSample, mapGroupKeyTitle, renderableValueKeys })
        if (mapLayer === MAP_LAYERS.scatterplot) {
          const latitude = dataKeys.find(key => COORD_KEYS.latitude.includes(key))
          const longitude = dataKeys.find(key => COORD_KEYS.longitude.includes(key))
          return Boolean(latitude && longitude && dataIsValid)
        }
        if (mapLayer === MAP_LAYERS.geojson) {
          return GEO_KEY_TYPES[GEO_KEY_TYPE_NAMES.region].includes(domain?.value) ?
            mapDataIsValid({ dataSample: dataSample.properties, mapGroupKeyTitle, renderableValueKeys }) :
            dataIsValid
        }
      }
      return false
    }),

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

  undoAvailable: computed([state => state.undoQueue], undoQueue => Boolean(undoQueue.length)),
  redoAvailable: computed([state => state.redoQueue], redoQueue => Boolean(redoQueue.length)),

  /** ACTIONS ------------------------------------------------------------------ */

  toast: thunk(async (actions, payload) => {
    actions.update({
      ui: {
        toastConfig: payload,
        showToast: true,
      },
    })
    setTimeout(() => actions.update({ ui: { showToast: false } }), 3000)
  }),

  getScreenshotBase64: thunk(async (actions, payload, { getState }) => {
    const { ui: { screenshotRef } } = getState()
    const type = 'image/png'
    return await screenshot(screenshotRef, type)
  }),

  save: thunk(async (actions, _, { getState }) => {
    const { config, tentativeConfig, id, wl, cu, saveWithInsightsData, reportType } = getState()
    if (!config) {
      actions.toast({
        title: `The widget is not configured yet, but will be ${id ? 'saved' : 'created'} anyway.`,
        color: 'warning',
      })
    }
    const snapshot = await actions.getScreenshotBase64()
    const saveFn = id && !`${id}`.startsWith('dev-')
      ? saveWidget
      : createWidget
    saveFn({
      // TO DELETE: workaround until we implemet data source tree selection
      config: saveWithInsightsData ?
        {
          ...tentativeConfig,
          dataSource: {
            type: dataSourceTypes.INSIGHTS_DATA,
            id: reportType,
          },
        } :
        tentativeConfig,
      snapshot,
      id,
      whitelabel: wl,
      customer: cu,
    })
      .then(({ status }) => {
        if (`${status}`.startsWith('2')) {
          actions.update({ unsavedChanges: false })
          actions.toast({
            title: 'Widget saved successfully',
            color: 'success',
          })
        } else {
          actions.toast({
            title: 'There was en error saving your widget',
            color: 'error',
          })
        }
      })
  }),

  loadConfigByID: thunk(async (actions, payload, { getState }) => {
    actions.update({
      ignoreUndo: true,
      ui: { configLoading: true },
      id: payload,
    })
    const { sampleConfigs } = getState()
    const getFn = sampleConfigs
      ? localGetWidget
      : getWidget
    getFn(payload, sampleConfigs)
      .then(({ config, updated_at, created_at }) => {
        actions.update({
          meta: {
            updatedAt: updated_at,
            createdAt: created_at,
          },
        })
        actions.loadConfig(config)
      })
      .catch(err => {
        actions.update({
          ui: {
            error: err,
            dataSourceLoading: false,
          },
          ignoreUndo: false,
        })
      })
  }),

  loadConfig: thunk(async (actions, payload, { getState }) => {
    actions.update({
      ignoreUndo: true,
      ui: { configLoading: true },
    })
    const { dataSource, ...config } = payload
    // populate state with safe default values
    actions.update({
      ...Object.fromEntries(stateDefaults.filter(s => s.resettable)
        .map(({ key, defaultValue }) => ([key, defaultValue]))),
      ...(config?.type && {
        uniqueOptions: Object.fromEntries(
          Object.entries(typeInfo[config.type].uniqueOptions)
            .map(([k, { defaultValue }]) => [k, defaultValue])),
      }),
    })
    // populate state with values from config
    actions.update(config)
    actions.update({ ui: { configLoading: false } })
    // move on to the data loading step:
    const { dataSource: previousDataSource } = getState()
    if (dataSource?.type === dataSourceTypes.INSIGHTS_DATA) {
      // if this widget wants insights data, it will receive that via props, via InsightsDataProvider
      actions.update({
        dataSource,
        ui: { dataSourceLoading: true },
      })
    } else if (dataSource
      && dataSource?.type !== previousDataSource?.type
      && dataSource?.id !== previousDataSource?.id
    ) {
      actions.loadData(dataSource)
    }
  }),

  loadData: thunk(async (actions, dataSource, { getState }) => {
    actions.update({
      ignoreUndo: true,
      ui: { dataSourceLoading: true },
      dataSource,
    })
    const { sampleData, dataSource: previousDataSource, cu } = getState()
    const init = !previousDataSource?.id || !previousDataSource?.type
    // TO DELETE: once Cox executions are not pulled from qldev stage, delete cu
    requestData(dataSource.type, dataSource.id, sampleData, cu)
      .then(({ data, name }) => {
        const { results: rows, columns, whitelabelID, customerID, clientToken } = data
        const yearMonthClient = clientToken?.match(/[_][0-6]{6}[_][0-9].*/g)?.[0]
        const reportType = clientToken?.replace(yearMonthClient, '')
        actions.update({
          rows,
          columns,
          wl: whitelabelID, // only used for wl-cu-selector
          cu: customerID, // only used for wl-cu-selector
          ui: {
            showWidgetControls: true,
            dataSourceName: name,
            dataSourceError: null,
          },
          reportType,
        })
        if (!init) {
          actions.toast({
            title: `${name} loaded successfully`,
            color: 'success',
          })
        }
      })
      .catch(err => { actions.update({ ui: { dataSourceError: err.toString() } }) })
      .finally(() => actions.update({
        ui: { dataSourceLoading: false },
        ignoreUndo: false,
      }))
  }),

  // update the store state in an "undoable" fashion
  userUpdate: thunk((actions, payload) => {
    actions.recordState()
    actions.update(payload)
    setTimeout(() => actions.setIgnoreUndo(false), 150)
  }),

  // update the store state
  update: action((state, payload) => deepMerge(payload, state)),

  // replace state with the first element from the undo queue
  undo: thunk((actions) => {
    actions.doUndo()
    setTimeout(() => actions.setIgnoreUndo(false), 150)
  }),
  doUndo: action(state => (
    state.undoQueue.length
      ? {
        ...state.undoQueue[0],
        undoQueue: state.undoQueue.slice(1),
        redoQueue: [{ ...state }].concat(state.redoQueue).slice(0, MAX_UNDO_STEPS),
        ignoreUndo: true,
      }
      : state
  )),

  // replace state with the first element from the redo queue
  redo: thunk((actions) => {
    actions.doRedo()
    setTimeout(() => actions.setIgnoreUndo(false), 150)
  }),
  doRedo: action(({ redoQueue, ...state }) => (
    redoQueue.length
      ? {
        ...redoQueue[0],
        redoQueue: redoQueue.slice(1),
        ignoreUndo: true,
      }
      : state
  )),

  // stores a snapshot of the current state at the beginning of the undo queue
  recordState: action(state => (
    state.ignoreUndo
      ? state
      : {
        ...state,
        unsavedChanges: true,
        undoQueue: [{ ...state }].concat(state.undoQueue).slice(0, MAX_UNDO_STEPS),
        ignoreUndo: true,
      }
  )),

  // reset a portion of the state
  resetValue: action((state, payload) => (
    {
      ...Object.keys(payload)
        .reduce((acc, k) => {
          acc[k] = stateDefaults.find(({ key }) => key === k).defaultValue
          return acc
        }, { ...state }),
      undoQueue: [{ ...state }].concat(state.undoQueue).slice(0, MAX_UNDO_STEPS),
    }
  )),

  // reset all shared and unique states except data source and data ID
  resetWidget: action((state) => ({
    ...state,
    ...Object.fromEntries(stateDefaults.filter(s => s.resettable)
      .map(({ key, defaultValue }) => ([key, defaultValue]))),
    ...(state.type && {
      uniqueOptions: Object.fromEntries(
        Object.entries(typeInfo[state.type].uniqueOptions)
          .map(([k, { defaultValue }]) => [k, defaultValue])
      ),
    }),
    ignoreUndo: true,
    undoQueue: [{ ...state }].concat(state.undoQueue).slice(0, MAX_UNDO_STEPS),
    // map widget doesn't have a switch to change group state, so we have to keep it true here
    group: state.type === types.MAP ? true : state.group,
  })),

  // on reset, set a 5 second timer during which reset cannot be re-enabled
  onReset: thunkOn((actions) => actions.resetWidget,
    (actions) => {
      setTimeout(() => actions.setRecentReset(false), 1000)
      setTimeout(() => actions.setIgnoreUndo(false), 1000)
      actions.setAllowReset(false)
      actions.setRecentReset(true)
    }),

  // re-enable reset whenever state is changed
  onUpdate: thunkOn((actions) => actions.update,
    (actions) => actions.setAllowReset(true)),

  // setter for ignoreUndo
  setIgnoreUndo: action((state, ignoreUndo) => ({ ...state, ignoreUndo })),

  // re-enable reset whenever state is changed, outside of update()
  setRecentReset: action((state, payload) => ({ ...state, ui: { ...state.ui, recentReset: payload } })),

  // set the ui.allowReset state outside of update() or nestedUpdate()
  setAllowReset: action((state, payload) => (
    !state.ui?.recentReset
      ? { ...state, ui: { ...state.ui, allowReset: payload } }
      : state
  )),
}
