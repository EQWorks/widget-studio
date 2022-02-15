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
import { deepMerge } from './util'
import { dateAggregations } from '../constants/time'
import { columnTypes } from '../constants/columns'
import { columnInference } from '../util/columns'


const MAX_UNDO_STEPS = 10


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
  { key: 'sortBy', defaultValue: null, resettable: true },
  {
    key: 'genericOptions', defaultValue: {
      showWidgetTitle: false,
      groupByValue: false,
      showLegend: true,
      showTooltip: true,
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
  { key: 'undoQueue', defaultValue: [], resettable: false },
  { key: 'redoQueue', defaultValue: [], resettable: false },
  { key: 'ignoreUndo', defaultValue: false, resettable: false },
  { key: 'dateAggregation', defaultValue: dateAggregations.NONE, resettable: true },
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
          filters: filters.filter(({ key, filter }) => key && filter),
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
    ],
    (
      group,
      type,
      mapGroupKey,
      indexKey,
      groupKey,
    ) => {
      let res = {}
      if (type === types.MAP) {
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

  /** checks if all initial states have been filled */
  isReady: computed(
    [
      (state) => state.rows,
      (state) => state.columns,
      (state) => state.type,
      (state) => state.renderableValueKeys,
      (state) => state.domain,
      (state) => state.transformedData,
    ],
    (
      rows,
      columns,
      type,
      renderableValueKeys,
      domain,
      transformedData,
    ) => (
      Boolean(type && columns.length && rows.length && transformedData?.length &&
        renderableValueKeys.length && domain.value)
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

  undoAvailable: computed([state => state.undoQueue], undoQueue => Boolean(undoQueue.length)),
  redoAvailable: computed([state => state.redoQueue], redoQueue => Boolean(redoQueue.length)),

  dev: computed([], () => ((process?.env?.NODE_ENV || 'development') === 'development')),

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

  loadConfig: thunk(async (actions, payload) => {
    actions.update({
      ignoreUndo: true,
      ui: {
        showDataSourceControls: false,
        dataSourceLoading: true,
      },
    })
    requestConfig(payload)
      .then(({ dataSource, ...config }) => {
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
        actions.loadData(dataSource)
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

  loadData: thunk(async (actions, dataSource, { getState }) => {
    actions.update({
      ignoreUndo: true,
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
          ui: {
            showWidgetControls: true,
            dataSourceName: name,
            dataSourceError: null,
          },
        })
        if (isReload) {
          actions.toast({
            title: `${name} reloaded successfully`,
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
