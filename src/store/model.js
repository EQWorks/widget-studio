import { getTailwindConfigColor } from '@eqworks/lumen-labs'
import { computed, action, thunk, thunkOn } from 'easy-peasy'

import { deepMerge } from './util'
import { cleanUp, truncateString } from '../util/string-manipulation'
import { createWidget, saveWidget, getWidget, localGetWidget, requestData } from '../util/api'
import { geoKeyHasCoordinates } from '../util'
import { getKeyFormatFunction } from '../util/data-format-functions'
import { columnInference } from '../util/columns'
import { mapDataIsValid } from '../util/map_data_validation'
import { screenshot } from '../util/export'
import types from '../constants/types'
import typeInfo from '../constants/type-info'
import cardTypes from '../constants/card-types'
import { COLOR_REPRESENTATIONS, DEFAULT_PRESET_COLORS } from '../constants/color'
import {
  MAP_LAYERS,
  MAP_GEO_KEYS,
  GEO_KEY_TYPES,
  MAP_LAYER_GEO_KEYS,
  COORD_KEYS,
  GEO_KEY_TYPE_NAMES,
  MAP_VIEW_STATE,
  GEOJSON_KEYS,
} from '../constants/map'
import { DATA_KEY_FORMATTING } from '../constants/data-format'
import { dateAggregations } from '../constants/time'
import { columnTypes } from '../constants/columns'
import { EXPORT_TYPES } from '../constants/export'
import { dataSourceTypes } from '../constants/data-source'
import { CHART_Z_POSITIONS } from '../constants/viz-options'


const MAX_UNDO_STEPS = 10

const stateDefaults = [
  { key: 'id', defaultValue: null, resettable: false },
  { key: 'title', defaultValue: 'Untitled Widget', resettable: false },
  { key: 'subtitle', defaultValue: '', resettable: false },
  { key: 'subtitleLinkLabel', defaultValue: '', resettable: true },
  { key: 'subtitleHyperlink', defaultValue: '', resettable: true },
  { key: 'showTitleBar', defaultValue: true, resettable: false },
  { key: 'type', defaultValue: '', resettable: true },
  { key: 'filters', defaultValue: [], resettable: true },
  { key: 'group', defaultValue: false, resettable: true },
  { key: 'groupFilter', defaultValue: [], resettable: true },
  { key: 'groups', defaultValue: [], resettable: true },
  { key: 'groupKey', defaultValue: null, resettable: true },
  { key: 'mapGroupKey', defaultValue: null, resettable: true },
  { key: 'indexKey', defaultValue: null, resettable: true },
  { key: 'valueKeys', defaultValue: [], resettable: true },
  { key: 'chart2ValueKeys', defaultValue: [], resettable: true },
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
      showWidgetTitle: true,
      groupByValue: false,
      showLegend: true,
      showTooltip: true,
      showAxisTitles: {
        x: true,
        y: true,
        y2: true,
      },
      axisTitles: {
        x: '',
        y: '',
        y2: '',
      },
      showSubPlotTitles: true,
      showLabels: false,
      showCurrency: false,
      showVertical: false,
      addAggregationLabel: false,
      mapHideSourceLayer: false,
      mapHideTargetLayer: false,
      mapHideArcLayer: false,
      showLocationPins: false,
      mapPinTooltipKey: null,
      subPlots: false,
      size: 0.8,
      titlePosition: [0, 0],
      legendPosition: [1, 0],
      labelPosition: 'Bottom',
      legendSize: 'Small',
      baseColor: {
        color1: getTailwindConfigColor('primary-500'),
        color2: getTailwindConfigColor('warning-500'),
      },
      xAxisLabelLength: 5,
      chart1ZPosition: CHART_Z_POSITIONS.back,
    }, resettable: true,
  },
  {
    key: 'dataSource', defaultValue: {
      type: null,
      id: null,
    },
    resettable: false,
  },
  { key: 'noDataSource', defaultValue: false, resettable: false },
  { key: 'rows', defaultValue: [], resettable: false },
  { key: 'columns', defaultValue: [], resettable: false },
  { key: 'columnNameAliases', defaultValue: {}, resettable: true },
  { key: 'transformedData', defaultValue: [], resettable: false },
  { key: 'dataHasVariance', defaultValue: true, resettable: false },
  // TO DELETE or change in the future when we implement data tree selection
  { key: 'saveWithInsightsData', defaultValue: false, resettable: false },
  { key: 'reportType', defaultValue: null, resettable: true },
  { key: 'reportSuffix', defaultValue: null, resettable: true },
  { key: 'percentageMode', defaultValue: false, resettable: true },
  { key: 'addUserControls', defaultValue: false, resettable: true },
  { key: 'addTopCategories', defaultValue: false, resettable: true },
  { key: 'userControlHeadline', defaultValue: 'Benchmark By', resettable: true },
  { key: 'userControlKeyValues', defaultValue: [], resettable: true },
  { key: 'categoryFilter', defaultValue: null, resettable: true },
  { key: 'userValueFilter', defaultValue: [], resettable: true },
  { key: 'dataCategoryKey', defaultValue: null, resettable: true },
  { key: 'selectedCategValue', defaultValue: null, resettable: true },
  {
    key: 'widgetControlCardEdit',
    defaultValue: Object.fromEntries(Object.keys(cardTypes).map(type => ([type, false]))) ,
    resettable: true,
  },
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
      widgetBaseColor1Selection: true,
      allowReset: true,
      recentReset: false,
      showToast: false,
      toastConfig: {},
      exportType: EXPORT_TYPES[0],
      screenshotRef: null,
      image: null,
      onWidgetRender: () => {},
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
  { key: 'mapTooltipLabelTitles', defaultValue: null, resettable: false },
  { key: 'aliasesReseted', defaultValue: false, resettable: true },
  { key: 'useMVTOption', defaultValue: true, resettable: true },
  { key: 'MVTOptionProp', defaultValue: null, resettable: false },
  { key: 'customColors', defaultValue: {}, resettable: false },
  { key: 'customColorProp', defaultValue: null, resettable: false },
  { key: 'customDataFormat', defaultValue: {}, resettable: false },
  { key: 'insightsDataCategories', defaultValue: {}, resettable: false },
  { key: 'categoryOrder', defaultValue: [], resetable: false },
]

export default {

  /** STATE ------------------------------------------------------------------ */
  ...Object.fromEntries(stateDefaults.map(({ key, defaultValue }) => ([key, defaultValue]))),

  /** COMPUTED STATE ------------------------------------------------------------ */

  tentativeConfig: computed(
    [
      (state) => state.title,
      (state) => state.subtitle,
      (state) => state.subtitleLinkLabel,
      (state) => state.subtitleHyperlink,
      (state) => state.showTitleBar,
      (state) => state.type,
      (state) => state.filters,
      (state) => state.groupFilter,
      (state) => state.group,
      (state) => state.groupKey,
      (state) => state.mapGroupKey,
      (state) => state.useMVTOption,
      (state) => state.indexKey,
      (state) => state.renderableValueKeys,
      (state) => state.formatDataKey,
      (state) => state.formatDataFunctions,
      (state) => state.genericOptions,
      (state) => state.uniqueOptions,
      (state) => state.isReady,
      (state) => state.columnNameAliases,
      (state) => state.formattedColumnNames,
      (state) => state.dataSource,
      (state) => state.noDataSource,
      (state) => state.percentageMode,
      (state) => state.addUserControls,
      (state) => state.userControlHeadline,
      (state) => state.userControlKeyValues,
      (state) => state.addTopCategories,
      (state) => state.categoryFilter,
      (state) => state.presetColors,
      (state) => state.dateAggregation,
      (state) => state.mapTooltipLabelTitles,
      (state) => state.customColors,
    ],
    (
      title,
      subtitle,
      subtitleLinkLabel,
      subtitleHyperlink,
      showTitleBar,
      type,
      filters,
      groupFilter,
      group,
      groupKey,
      mapGroupKey,
      useMVTOption,
      indexKey,
      renderableValueKeys,
      formatDataKey,
      formatDataFunctions,
      genericOptions,
      uniqueOptions,
      isReady,
      columnNameAliases,
      formattedColumnNames,
      { type: dataSourceType, id: dataSourceID },
      noDataSource,
      percentageMode,
      addUserControls,
      userControlHeadline,
      userControlKeyValues,
      addTopCategories,
      categoryFilter,
      presetColors,
      dateAggregation,
      mapTooltipLabelTitles,
      customColors,
    ) => ({
      title,
      subtitle,
      subtitleLinkLabel,
      subtitleHyperlink,
      showTitleBar,
      type,
      filters: filters.filter(({ key, filter }) => key && filter),
      groupFilter,
      valueKeys: type !== types.MAP && renderableValueKeys ? renderableValueKeys.filter(({ type }) => !type) : [],
      chart2ValueKeys: type !== types.MAP && renderableValueKeys ? renderableValueKeys.filter(({ type }) => type) : [],
      mapValueKeys: type === types.MAP ? renderableValueKeys : [],
      formatDataKey,
      formatDataFunctions,
      columnNameAliases,
      formattedColumnNames,
      group,
      groupKey,
      mapGroupKey,
      useMVTOption,
      indexKey,
      ...(groupKey && { groupKeyTitle: formattedColumnNames[groupKey] } || groupKey),
      ...(mapGroupKey && { mapGroupKeyTitle: formattedColumnNames[mapGroupKey] } || mapGroupKey),
      ...(indexKey && { indexKeyTitle: formattedColumnNames[indexKey] } || indexKey),
      uniqueOptions,
      genericOptions,
      noDataSource,
      dataSource: { type: dataSourceType, id: dataSourceID },
      percentageMode,
      addUserControls,
      userControlHeadline,
      userControlKeyValues,
      addTopCategories,
      categoryFilter,
      presetColors,
      dateAggregation,
      mapTooltipLabelTitles,
      customColors,
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
      (state) => state.columnsAnalysis,
      (state) => state.group,
      (state) => state.type,
      (state) => state.mapGroupKey,
      (state) => state.indexKey,
      (state) => state.groupKey,
      (state) => state.dataIsXWIReport,
    ],
    (
      columnsAnalysis,
      group,
      type,
      mapGroupKey,
      indexKey,
      groupKey,
      dataIsXWIReport,
    ) => {
      let res = {}
      const dataKeys = Object.keys(columnsAnalysis) || []
      const sourcePOIId = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.scatterplot.includes(key))
      if (type === types.MAP) {
        if (!dataIsXWIReport) {
          res = { mapGroupKey }
        }
        // TO CHANGE in the future: workaround to add a group key for xwi report data case for map widget
        if (dataIsXWIReport) {
          res = { mapGroupKey : sourcePOIId }
        }
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

  showMVTOption: computed(
    [
      (state) => state.type,
      (state) => state.columnsAnalysis,
      (state) => state.rows,
    ],
    (
      type,
      columnsAnalysis,
      rows,
    ) => {
      const dataSample = rows[0]
      return type === types.MAP
        && GEOJSON_KEYS.every(key => Object.keys(columnsAnalysis)?.includes(key) && dataSample[key])
    }
  ),

  // determines to use postal code geo key to aggregate by FSA
  groupFSAByPC: computed(
    [
      (state) => state.mapGroupKey,
      (state) => state.columnsAnalysis,
    ],
    (
      mapGroupKey,
      columnsAnalysis,
    ) => GEO_KEY_TYPES.fsa.includes(mapGroupKey) &&
      !Object.keys(columnsAnalysis).includes(mapGroupKey)
  ),

  lon: computed(
    [
      (state) => state.columnsAnalysis,
    ],
    (columnsAnalysis) => Object.keys(columnsAnalysis || {}).find(key => COORD_KEYS.longitude.includes(key))
  ),

  lat: computed(
    [
      (state) => state.columnsAnalysis,
    ],
    (columnsAnalysis) => Object.keys(columnsAnalysis || {}).find(key => COORD_KEYS.latitude.includes(key))
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
      (state) => state.chart2ValueKeys,
      (state) => state.mapValueKeys,
      (state) => state.group,
      (state) => state.type,
      (state) => state.dataHasVariance,
      (state) => state.formattedColumnNames,
      (state) => state.genericOptions.addAggregationLabel,
    ],
    (
      valueKeys,
      chart2ValueKeys,
      mapValueKeys,
      group,
      type,
      dataHasVariance,
      formattedColumnNames,
      addAggregationLabel
    ) => {
      if (type === types.TEXT) {
        return valueKeys
      }
      return (type === types.MAP ? mapValueKeys : [...valueKeys, ...chart2ValueKeys])
        .filter(({ key, agg }) => key && (agg || !dataHasVariance || !group))
        .map(({ key, agg, ...rest }) => ({
          ...rest,
          key,
          title: `${formattedColumnNames[key]}${group && agg && dataHasVariance && addAggregationLabel
            ? ` (${agg})`
            : ''}`
            || key,
          ...(agg && { agg }),
          ...(type === types.BARLINE && chart2ValueKeys.find(el => el.key === key) && { type: types.LINE }),
        }))
    }
  ),

  formattedColumnNames: computed(
    [
      (state) => state.columns,
      (state) => state.groupFSAByPC,
      (state) => state.columnNameAliases,
    ],
    (
      columns,
      groupFSAByPC,
      columnNameAliases,
    ) => (
      Object.fromEntries(columns.map(({ name }) => [name, columnNameAliases?.[name] || cleanUp(name)])
        .concat(groupFSAByPC ? [['geo_ca_fsa', cleanUp('geo_ca_fsa')]] : []))
    )
  ),

  formatDataFunctions: computed(
    [
      (state) => state.renderableValueKeys,
      (state) => state.customDataFormat,
      (state) => state.type,
    ],
    (
      renderableValueKeys,
      customDataFormat,
      type,
    ) => type !== types.TEXT && Object.fromEntries(renderableValueKeys.map(({ key, title }) => (
      [title, getKeyFormatFunction(key, { ...customDataFormat, ...DATA_KEY_FORMATTING })]
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
      (state) => state.noDataSource,
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
      noDataSource,
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
      return isXWIReportMap || (type && noDataSource && renderableValueKeys.length) ||
        Boolean(mapChartReady && !isLoading && columns.length && rows.length &&
          transformedData?.length && renderableValueKeys.length && domain.value)
    }),

  dataIsXWIReport: computed(
    [
      (state) => state.columnsAnalysis,
      (state) => state.lon,
      (state) => state.lat,
    ],
    (
      columnsAnalysis,
      lon,
      lat,
    ) => {
      const dataKeys = Object.keys(columnsAnalysis || {})
      const findCoord = coordArray => dataKeys?.find(key => coordArray.includes(key))
      const targetLon = findCoord(COORD_KEYS.targetLon)
      const targetLat = findCoord(COORD_KEYS.targetLat)
      const sourcePOIid = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.scatterplot.includes(key))
      const targetPOIid = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.targetScatterplot.includes(key))
      return Boolean(lon && lat && targetLon && targetLat &&
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

  finalUserControlKeyValues: computed(
    [
      (state) => state.type,
      (state) => state.categoryFilter,
      (state) => state.rows,
      (state) => state.userControlKeyValues,
      (state) => state.wl,
      (state) => state.insightsDataCategories,
      (state) => state.categoryOrder,
    ],
    (
      type,
      categoryFilter,
      rows,
      userControlKeyValues,
      wl,
      insightsDataCategories,
      categoryOrder,
    ) => {
      if (type === types.MAP) {
        // use data categories if present in the data object
        if (categoryFilter) {
          const userCategoryControlKeyValues = rows.reduce((acc, el) => acc.includes(el[categoryFilter]) ?
            acc :
            [...acc, el[categoryFilter]], [])
          if (categoryOrder.length && userCategoryControlKeyValues.every(el => categoryOrder.includes(el))) {
            return categoryOrder.filter(el => userCategoryControlKeyValues.includes(el))
          }
          return userCategoryControlKeyValues
        }
        // for map widget with no categoryFilter the finalUserControlKeyValues is a mix of column keys & data categories
        return userControlKeyValues.reduce((acc, key) => {
          const category = Object.values(insightsDataCategories).flat().includes(key) ?
            Object.keys(insightsDataCategories).find(e => insightsDataCategories[e]?.includes(key)) :
            key
          acc = category && acc.includes(category) ? acc : [...acc, category]
          return acc
        }, [])
      }
      return userControlKeyValues
    }
  ),

  selectedUserDataControlIndex: computed(
    [
      (state) => state.addUserControls,
      (state) => state.type,
      (state) => state.renderableValueKeys,
      (state) => state.finalUserControlKeyValues,
      (state) => state.dataCategoryKey,
    ],
    (
      addUserControls,
      type,
      renderableValueKeys,
      finalUserControlKeyValues,
      dataCategoryKey,
    ) => {
      if (addUserControls) {
        if (type === types.BAR && renderableValueKeys.length > 1 &&
          finalUserControlKeyValues.includes(renderableValueKeys[1].key)) {
          return finalUserControlKeyValues.indexOf(renderableValueKeys[1].key)
        }
        if (type === types.MAP && renderableValueKeys.length > 0) {
          if (!dataCategoryKey &&
            finalUserControlKeyValues.includes(renderableValueKeys[0].key)){
            return finalUserControlKeyValues.indexOf(renderableValueKeys[0].key)
          } else if (dataCategoryKey) {
            return finalUserControlKeyValues.indexOf(dataCategoryKey)
          }
        }
      }
    }
  ),

  categoryKeyValues: computed(
    [
      (state) => state.type,
      (state) => state.categoryFilter,
      (state) => state.dataCategoryKey,
      (state) => state.userControlKeyValues,
      (state) => state.formattedColumnNames,
      (state) => state.insightsDataCategories,
    ],
    (
      type,
      categoryFilter,
      dataCategoryKey,
      userControlKeyValues,
      formattedColumnNames,
      insightsDataCategories,
    ) => {
      if (type === types.MAP && userControlKeyValues.length) {
        if (categoryFilter) {
          return userControlKeyValues.map(key => ({ title: formattedColumnNames[key], key }))
        }
        if (dataCategoryKey) {
          return userControlKeyValues.filter(val => insightsDataCategories[dataCategoryKey]?.includes(val))
            .map(key => ({ title: formattedColumnNames[key], key }))
        }
      }
      return []
    }
  ),

  selectedCategoryValue: computed(
    [
      (state) => state.type,
      (state) => state.renderableValueKeys,
      (state) => state.categoryKeyValues,
    ],
    (
      type,
      renderableValueKeys,
      categoryKeyValues,
    ) => (Boolean(type === types.MAP && renderableValueKeys?.length && categoryKeyValues?.length) &&
      (categoryKeyValues.find(e => e.key === renderableValueKeys[0].key) || categoryKeyValues[0])) || {}
  ),

  enableLocationPins: computed(
    [
      (state) => state.lon,
      (state) => state.lat,
      (state) => state.dataIsXWIReport,
      (state) => state.type,
    ],
    (
      lon,
      lat,
      dataIsXWIReport,
      type,
    ) => Boolean(type === types.MAP && lat && lon && !dataIsXWIReport)
  ),

  mapInitViewState: computed(
    [
      (state) => state.columnsAnalysis,
      (state) => state.isXWIReportMap,
      (state) => state.type,
      (state) => state.rows,
    ],
    (
      columnsAnalysis,
      isXWIReportMap,
      type,
      rows,
    ) => {
      const lat = Object.keys(columnsAnalysis || {}).find(key => key === MAP_VIEW_STATE.lat)
      const lon = Object.keys(columnsAnalysis || {}).find(key => key === MAP_VIEW_STATE.lon)

      if (type === types.MAP && lat && lon && !isXWIReportMap) {
        return {
          latitude: rows?.[0][lat],
          longitude: rows?.[0][lon],
        }
      }
      return {}
    }
  ),

  /** ACTIONS ------------------------------------------------------------------ */

  toast: thunk(async (actions, payload) => {
    actions.update({
      ui: {
        toastConfig: payload,
        showToast: true,
      },
    })
    setTimeout(() => actions.update({ ui: { showToast: false } }), payload.timeout || 3000)
  }),

  getScreenshotBase64: thunk(async (actions, payload, { getState }) => {
    const { ui: { screenshotRef } } = getState()
    const type = 'image/png'
    return await screenshot(screenshotRef, type)
  }),

  save: thunk(async (actions, _, { getState }) => {
    const { config, tentativeConfig, id, wl, cu, saveWithInsightsData, reportType, reportSuffix, dataSource } = getState()
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
      /**TO DELETE: workaround until we implemet data source tree selection; also need to replicate
        this code from DataSourceControls as the last sets the data source to get results for the widgets
        using either executions or insights data (we still use execution results when creating a widget),
        and the second saves a widget with the particular data configuration needed for the widget
        (ie widgets created with InsigthsDataProvider will be saved with insights data type of data source,
        the rest will be saved with execution type of data source)
      */
      // when creating a new widget with an execution using InsightsDataProvider, dataSource.types is execution type
      config: saveWithInsightsData && dataSource.type !== dataSourceTypes.INSIGHTS_DATA ?
        {
          ...tentativeConfig,
          dataSource: {
            type: dataSourceTypes.INSIGHTS_DATA,
            id: reportType + reportSuffix,
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
    const { sampleConfigs, mapGroupKey, MVTOptionProp, customColorProp } = getState()
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
        // while updating with config, use mapGroupKey & useMVTOption Widget prop values
        actions.loadConfig({
          ...config,
          ...(mapGroupKey && { mapGroupKey }),
          ...(MVTOptionProp !== null && { useMVTOption: MVTOptionProp }),
          ...(customColorProp && { customColors: customColorProp }),
        })
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
        const { results: rows, columns, whitelabelID, customerID } = data
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
