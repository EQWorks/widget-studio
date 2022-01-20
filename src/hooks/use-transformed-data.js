import { useEffect, useMemo } from 'react'

import { useStoreActions, useStoreState } from '../store'
import aggFunctions from '../util/agg-functions'
import { COORD_KEYS, MAP_LAYER_GEO_KEYS } from '../constants/map'


const useTransformedData = () => {

  // actions
  const update = useStoreActions((state) => state.update)

  // state
  const rows = useStoreState((state) => state.rows)
  const type = useStoreState((state) => state.type)
  const columns = useStoreState((state) => state.columns)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const filters = useStoreState((state) => state.filters)
  const indexKey = useStoreState((state) => state.indexKey)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)

  // truncate the data when the filters change
  const truncatedData = useMemo(() => (
    rows.filter(obj => {
      for (const [key, [min, max]] of Object.entries(filters)) {
        if (obj[key] < min || obj[key] > max) {
          return false
        }
      }
      return true
    })
  ), [rows, filters])

  const finalGroupKey = useMemo(() => type === 'map' ? mapGroupKey : groupKey, [type, mapGroupKey, groupKey])

  // if grouping enabled, memoize grouped and reorganized version of data that will be easy to aggregate
  const groupedData = useMemo(() => (
    group
      ? truncatedData.reduce((res, r) => {
        const group = r[finalGroupKey]
        res[group] = res[group] || {}
        Object.entries(r).forEach(([k, v]) => {
          if (k !== finalGroupKey) {
            if (res[group][k]) {
              res[group][k].push(v)
            } else {
              res[group][k] = [v]
            }
          }
        })
        return res
      }, {})
      : null
  ), [group, finalGroupKey, truncatedData])

  // compute list of columns that have 0 variance
  const zeroVarianceColumns = useMemo(() => (
    group
      ? columns.map(({ name }) => name).filter(c => (
        c !== finalGroupKey &&
        Object.values(groupedData).every(d => {
          return d[c].length === 1
        })))
      : []
  ), [columns, group, finalGroupKey, groupedData])

  // relay this to global state
  useEffect(() => {
    update({ zeroVarianceColumns })
  }, [update, zeroVarianceColumns])

  // if grouping enabled, aggregate each column from renderableValueKeys in groupedData according to defined 'agg' property
  const aggregatedData = useMemo(() => (
    group
      ? Object.entries(groupedData).map(([_groupKey, values]) => (
        renderableValueKeys.reduce((res, { key, agg }) => {
          res[`${key}_${agg}`] = zeroVarianceColumns.includes(key)
            ? values[key][0]
            : aggFunctions[agg](values[key])
          return res
        }, { [finalGroupKey]: _groupKey })
      ))
      : null
  ), [group, finalGroupKey, groupedData, renderableValueKeys, zeroVarianceColumns])

  const mapEnrichedData = useMemo(() => {
    if (type === 'map') {
      //---TODO - Erika: complete this to include coordinates for xwi report; this is only for scatterplot layer
      // add coordinates for map widget data
      if (MAP_LAYER_GEO_KEYS.scatterplot.includes(mapGroupKey)) {
        return aggregatedData.map((d) => {
          const lat = numericColumns.find(key => COORD_KEYS.latitude.includes(key))
          const lon = numericColumns.find(key => COORD_KEYS.longitude.includes(key))
          if (lat && lon && MAP_LAYER_GEO_KEYS.scatterplot.includes(mapGroupKey)) {
            if (d[lat] && d[lon]) {
              return d
            }
            const { [lat]: [_lat], [lon]: [_lon] } = groupedData[d[mapGroupKey]]
            return {
              ...d,
              lat: _lat,
              lon: _lon,
            }
          }
        })
      }
      if (MAP_LAYER_GEO_KEYS.geojson.includes(mapGroupKey)) {
        return aggregatedData
      }
    }
    return null
  }, [type, aggregatedData, numericColumns, mapGroupKey, groupedData])

  // simply sort the data if grouping is not enabled
  const indexedData = useMemo(() => (
    !group
      ? truncatedData.sort((a, b) => a[indexKey] - b[indexKey])
      : null
  ), [group, indexKey, truncatedData])

  // memoize the final data processing according to whether grouping is enabled
  const finalData = useMemo(() => {
    if (type === 'map') {
      return mapEnrichedData
    }
    if (group) {
      return aggregatedData
    }
    return indexedData
  }, [aggregatedData, group, indexedData, mapEnrichedData, type])

  return finalData
}

export default useTransformedData
