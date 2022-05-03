import {
  COORD_KEYS,
  MAP_GEO_KEYS,
  XWI_REPORT,
} from '../constants/map'


/**
 * isUniqueKey - determines if a key in the data object has a value that shouldn't be aggregated
 * @param { object } param
 * @param { string } param.k - string data object key
 * @param { string } param.sourcePOIid - string source POI id key
 * @param { string } param.targetPOIid - string target POI id key
 * @returns { boolean } - whether a key is a unique key
 */
export const isUniqueKey = ({ k, sourcePOIId, targetPOIId }) =>
  Boolean(k === sourcePOIId || k === targetPOIId || MAP_GEO_KEYS.includes(k) ||
    Object.values(COORD_KEYS).flat().includes(k) || k.includes(XWI_REPORT.target))

/**
 * xwiAggData - aggregation function for xwi report data
 * @param { object } param
 * @param { array } param.data - array of data objects
 * @param { array || string } param.groupKey - a string key or an array of keys that is used to group data by
 * @param { string } param.sourcePOIId - string source POI id key
 * @param { string } param.targetPOIId - string target POI id key
 * @param { object } param.columnsAnalysis - object of pairs { column, value } that classifies data column
 * @returns { array } - array of aggregated data objects
 */
export const xwiAggData = ({ data, groupKey, sourcePOIId, targetPOIId, columnsAnalysis }) =>
  Object.values(data.reduce((res, r) => {
    let group = r[groupKey]
    if (typeof groupKey !== 'string' && groupKey?.length) {
      group = `${r[groupKey[0]]}-${r[groupKey[1]]}`
    }
    res[group] = res[group] || {}
    Object.entries(r).forEach(([k, v]) => {
      const uniqueKey = isUniqueKey({ k, sourcePOIId, targetPOIId })
      if (res[group][k]) {
        if (columnsAnalysis[k]?.isNumeric && !uniqueKey) {
          res[group][k] += v
        } else if (!uniqueKey) {
          res[group][k].push(v)
        }
      } else if (columnsAnalysis[k]?.isNumeric || uniqueKey) {
        res[group][k] = v
      } else {
        res[group][k] = [v]
      }
    })
    return res
  }, {}))
