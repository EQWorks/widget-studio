import aggFunctions from './agg-functions'
import {
  COORD_KEYS,
  MAP_GEO_KEYS,
  XWI_REPORT,
  MAP_LAYER_GEO_KEYS,
} from '../constants/map'


/**
 * isUniqueKey - determines if a key in the data object has a value that shouldn't be aggregated
 * @param { object } param
 * @param { string } param.k - string data object key
 * @param { string } param.sourcePOIid - string source POI id key
 * @param { string } param.targetPOIid - string target POI id key
 * @param { string } param.groupKey - string groupKey for one of the arc, source or target scatterplot layer data
 * @returns { boolean } - whether a key is a unique data key
 */
export const isUniqueKey = ({ k, sourcePOIId, targetPOIId, groupKey }) => {
  if (groupKey === sourcePOIId) {
    return Boolean(k === sourcePOIId ||
      [...COORD_KEYS.latitude, ...COORD_KEYS.longitude].includes(k) ||
      MAP_LAYER_GEO_KEYS.scatterplot.includes(k)) ||
      (k.includes(XWI_REPORT.source) && !k.includes(XWI_REPORT.target))
  }
  if (groupKey === targetPOIId) {
    return Boolean(k === targetPOIId ||
      [...COORD_KEYS.targetLat, ...COORD_KEYS.targetLon].includes(k) ||
      MAP_LAYER_GEO_KEYS.targetScatterplot.includes(k)) ||
      k.includes(XWI_REPORT.target)
  }
  if (typeof groupKey !== 'string') {
    return Boolean(k === sourcePOIId || k === targetPOIId || MAP_GEO_KEYS.includes(k) ||
      Object.values(COORD_KEYS).flat().includes(k) ||
      Object.values(XWI_REPORT).flat().some(key => k.includes(key)))
  }
}


/**
 * xMapAggData - aggregation function for xwi report data
 * @param { object } param
 * @param { array } param.data - array of data objects
 * @param { array || string } param.groupKey - a string key or an array of keys that is used to group data by
 * @param { string } param.sourcePOIId - string source POI id key
 * @param { string } param.targetPOIId - string target POI id key
 * @param { object } param.columnsAnalysis - object of pairs { column, value } that classifies data column
 * @param { object } param.formattedColumnNames - object of pairs { column, value } with formatted data keys
 * @param { array } param.groupFilter - array of domain string values to be used to filter data
 * @param { array } param.valueKeys - array of objects for map visualization configuration
 * @returns { array } - array of aggregated data objects
 */
export const xMapAggData = ({
  data,
  groupKey,
  sourcePOIId,
  targetPOIId,
  columnsAnalysis,
  formattedColumnNames,
  groupFilter,
  valueKeys,
}) => Object.values(data.reduce((res, r) => {
  if (!groupFilter.length ||
    (groupFilter?.length &&
      (typeof groupKey === 'string' &&
        ((groupKey === sourcePOIId && groupFilter.includes(r[groupKey]?.toString())) ||
        (groupKey !== sourcePOIId && groupFilter.includes(r[sourcePOIId]?.toString())))) ||
      (groupKey?.[0] === sourcePOIId && groupFilter.includes(r[groupKey?.[0]]?.toString()))))
  {
    let group = r[groupKey]
    if (typeof groupKey !== 'string' && groupKey?.length) {
      group = `${r[groupKey[0]]}-${r[groupKey[1]]}`
    }
    res[group] = res[group] || {}
    Object.entries(r).forEach(([k, v]) => {
      const uniqueKey = isUniqueKey({ k, sourcePOIId, targetPOIId, groupKey })
      const { agg, title } = valueKeys.find(({ key }) => k === key) || {}
      let finalKey
      // keep coord keys unformatted
      if (Object.values(COORD_KEYS).flat().includes(k)) {
        finalKey = k
      } else if (!(columnsAnalysis[k].isNumeric || Object.values(COORD_KEYS).flat().includes(k))) {
        finalKey = formattedColumnNames[k]
      } else {
        finalKey = title
      }

      if (res[group][finalKey]) {
        if (columnsAnalysis[k]?.isNumeric && !uniqueKey && agg) {
          res[group][finalKey] = aggFunctions[agg]([res[group][finalKey], v])
        }
      } else if ((columnsAnalysis[k]?.isNumeric && JSON.stringify(valueKeys).includes(finalKey))
        || uniqueKey) {
        res[group][finalKey] = v
      }
    })
  }
  return res
}, {}))
