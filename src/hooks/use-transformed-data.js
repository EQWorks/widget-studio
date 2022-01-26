import { useEffect, useMemo } from 'react'

import { useStoreActions, useStoreState } from '../store'
import aggFunctions from '../util/agg-functions'
import { COORD_KEYS, MAP_LAYER_GEO_KEYS, GEO_KEY_TYPES } from '../constants/map'


const useTransformedData = () => {

  // actions
  const update = useStoreActions((state) => state.update)

  // state
  const rows = useStoreState((state) => state.rows)
  const type = useStoreState((state) => state.type)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const filters = useStoreState((state) => state.filters)
  const indexKey = useStoreState((state) => state.indexKey)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const formattedColumnNames = useStoreState((state) => state.formattedColumnNames)
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const groupFSAByPC = useStoreState((state) => state.groupFSAByPC)

  const finalGroupKey = useMemo(() => type === 'map' ? mapGroupKey : groupKey, [type, mapGroupKey, groupKey])

  // truncate the data when the filters change
  const truncatedData = useMemo(() => (
    rows.filter(obj => {
      for (const [key, [min, max]] of Object.entries(filters).filter(([k]) => k !== finalGroupKey)) {
        if (obj[key] < min || obj[key] > max) {
          return false
        }
      }
      return true
    })
  ), [rows, filters, finalGroupKey])

  // if grouping enabled, memoize grouped and reorganized version of data that will be easy to aggregate
  const groupedData = useMemo(() => (
    group
      ? truncatedData.reduce((res, r) => {
        // use the key for postalcode to aggregate by FSA
        const newGroupKey = groupFSAByPC
          ? validMapGroupKeys.find(key => GEO_KEY_TYPES.postalcode.includes(key))
          : finalGroupKey
        // FSAs are the first 3 letters of a postal code
        const group = groupFSAByPC ? r[newGroupKey].slice(0,3) : r[newGroupKey]
        res[group] = res[group] || {}
        Object.entries(r).forEach(([k, v]) => {
          if (k !== newGroupKey) {
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
  ), [group, finalGroupKey, truncatedData, groupFSAByPC, validMapGroupKeys])


  // relay some information about the grouped data to global store
  useEffect(() => {
    if (groupedData) {
      // names of groups produced by the current grouping
      update({ groups: Object.keys(groupedData) })
      // whether the configured group key has produced data with any variance
      const data = Object.values(groupedData)
      if (data[0]) {
        const testKey = Object.keys(data[0])[0]
        update({ dataHasVariance: data.some(g => g[testKey].length > 1) })
      }
    }
  }, [update, groupedData])

  // if a filter on the finalGroupKey exists, retain only the desired groups
  const filteredGroupedData = useMemo(() => (
    group
      ? filters[finalGroupKey]?.length
        ? Object.fromEntries(Object.entries(groupedData).filter(([k]) => filters[finalGroupKey].includes(k)))
        : groupedData
      : null
  ), [filters, group, finalGroupKey, groupedData])

  // if grouping enabled, aggregate each column from renderableValueKeys in groupedData according to defined 'agg' property
  const aggregatedData = useMemo(() => (
    group
      ? Object.entries(filteredGroupedData).map(([group, values]) => (
        renderableValueKeys.reduce((res, { key, agg, title }) => {
          res[title] = dataHasVariance
            ? aggFunctions[agg](values[key])
            : values[key][0]
          return res
        }, { [formattedColumnNames[finalGroupKey]]: group })
      ))
      : null
  ), [dataHasVariance, filteredGroupedData, formattedColumnNames, group, finalGroupKey, renderableValueKeys])

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

  // simply format and sort data if grouping is not enabled
  const indexedData = useMemo(() => (
    !group
      ? truncatedData.map(d =>
        Object.fromEntries(Object.entries(d).map(([k, v]) => [formattedColumnNames[k], v]))
      ).sort((a, b) => a[formattedColumnNames[indexKey]] - b[formattedColumnNames[indexKey]])
      : null
  ), [formattedColumnNames, group, indexKey, truncatedData])

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
