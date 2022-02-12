import { useEffect, useMemo } from 'react'

import { useStoreActions, useStoreState } from '../store'
import aggFunctions from '../util/agg-functions'
import { COORD_KEYS, MAP_LAYER_GEO_KEYS, GEO_KEY_TYPES } from '../constants/map'
import types from '../constants/types'
import { roundToTwoDecimals } from '../util/numeric'
import { dateAggregations, dateSort } from '../constants/time'


const useTransformedData = () => {
  // actions
  const update = useStoreActions((state) => state.update)

  // state
  const rows = useStoreState((state) => state.rows)
  const type = useStoreState((state) => state.type)
  const columns = useStoreState((state) => state.columns)
  const filters = useStoreState((state) => state.filters)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const indexKey = useStoreState((state) => state.indexKey)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const percentageMode = useStoreState((state) => state.percentageMode)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const formattedColumnNames = useStoreState((state) => state.formattedColumnNames)
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const groupFSAByPC = useStoreState((state) => state.groupFSAByPC)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const domain = useStoreState((state) => state.domain)
  const domainIsDate = useStoreState((state) => state.domainIsDate)
  const dateAggregation = useStoreState((state) => state.dateAggregation)

  const finalGroupKey = useMemo(() => type === types.MAP ? mapGroupKey : groupKey, [type, mapGroupKey, groupKey])

  // convert prices to numeric values
  const normalizedPriceData = useMemo(() => {
    const priceColumns = columns.map(({ name }) => name).filter(c => columnsAnalysis[c]?.category === 'String' && c.includes('price'))
    return priceColumns.length
      ? rows.map(r =>
        Object.entries(r)
          .reduce((acc, [k, v]) => {
            if (priceColumns.includes(k)) {
              acc[k] = parseFloat((v.split('$')[1])?.replace(/,/g, '')) || v
            }
            return acc
          }, { ...r }))
      : rows
  }, [columns, columnsAnalysis, rows])

  // truncate the data when the filters change
  const truncatedData = useMemo(() => (
    normalizedPriceData.filter(obj => {
      for (const { key, filter: [min, max] } of filters.filter(({ filter }) => Boolean(filter))) {
        if (obj[key] < min || obj[key] > max) {
          return false
        }
      }
      return true
    })
  ), [normalizedPriceData, filters])

  const newGroupKey = useMemo(() => (
    groupFSAByPC
      // use the key for postalcode to aggregate by FSA
      ? validMapGroupKeys.find(key => GEO_KEY_TYPES.postalcode.includes(key))
      : finalGroupKey
  ), [groupFSAByPC, validMapGroupKeys, finalGroupKey])

  // if grouping enabled, memoize grouped and reorganized version of data that will be easy to aggregate
  const groupedData = useMemo(() => (
    group
      ? truncatedData.reduce((res, r) => {
        // FSAs are the first 3 letters of a postal code
        const group = groupFSAByPC ? r[newGroupKey].slice(0, 3) : r[newGroupKey]
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
  ), [group, truncatedData, groupFSAByPC, newGroupKey])


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
  const filteredGroupedData = useMemo(() => {
    if (!group) {
      return null
    }
    if (!groupFilter?.length) {
      return groupedData
    }
    if (domainIsDate) {
      const min = new Date(groupFilter[0])
      const max = new Date(groupFilter[1])
      return min && max
        ? Object.fromEntries(
          Object.entries(groupedData)
            .filter(([k]) => {
              const d = new Date(k)
              return min < d && d < max
            })
        )
        : groupedData
    }
    return Object.fromEntries(Object.entries(groupedData).filter(([k]) => groupFilter?.includes(k)))
  }, [domainIsDate, group, groupFilter, groupedData])


  // if grouping enabled, aggregate each column from renderableValueKeys in groupedData according to defined 'agg' property
  const aggregatedData = useMemo(() => {
    if (!group) return null
    const formattedDomain = formattedColumnNames[finalGroupKey]
    if (domainIsDate && dateAggregations[dateAggregation]) {
      // extra grouping required if Domain is date
      const { groupFn, sortFn } = dateAggregations[dateAggregation]
      const dateGroupedData = Object.entries(filteredGroupedData)
        .reduce((acc, [k, v]) => {
          const newKey = groupFn(k)
          if (!acc[newKey]) {
            acc[newKey] = []
          }
          acc[newKey].push(v)
          return acc
        }, {})
      return Object.entries(dateGroupedData).map(([k, v]) => ({
        [formattedDomain]: k,
        ...Object.fromEntries(renderableValueKeys.map(({ key, agg, title }) => (
          [title, aggFunctions[agg](v.map(_v => _v[key]).flat())]
        ))),
      })).sort((a, b) => sortFn(a[formattedDomain], b[formattedDomain]))
    }
    return Object.entries(filteredGroupedData).map(([group, values]) => {
      const res = renderableValueKeys.reduce((res, { key, agg, title }) => {
        const val = dataHasVariance
          ? aggFunctions[agg](values[key])
          : values[key][0]
        res[title] = val
        return res
      }, { [formattedDomain]: group })
      return res
    })
  }, [group, domainIsDate, formattedColumnNames, dateAggregation, filteredGroupedData, renderableValueKeys, finalGroupKey, dataHasVariance])

  const percentageData = useMemo(() => {
    if (!percentageMode) {
      return null
    }
    const sums = Object.fromEntries(
      renderableValueKeys.map(({ title }) => (
        [title, aggregatedData.reduce((_acc, el) => _acc + el[title], 0)]
      ))
    )
    const res = aggregatedData.map(d => (
      Object.entries(d).reduce((acc, [k, v]) => {
        acc[k] = k in sums
          ? roundToTwoDecimals(v / sums[k] * 100)
          : v
        return acc
      }, {})
    ))
    return res
  }, [aggregatedData, percentageMode, renderableValueKeys])

  const mapEnrichedData = useMemo(() => {
    if (type === types.MAP) {
      //---TODO - Erika: complete this to include coordinates for xwi report; this is only for scatterplot layer
      // add coordinates for map widget data
      if (MAP_LAYER_GEO_KEYS.scatterplot.includes(mapGroupKey)) {
        const lat = columns.find(({ name, category }) =>
          COORD_KEYS.latitude.includes(name) && category === 'Numeric')?.name
        const lon = columns.find(({ name, category }) =>
          COORD_KEYS.longitude.includes(name) && category === 'Numeric')?.name
        return aggregatedData.map((d) => {
          if (lat && lon && MAP_LAYER_GEO_KEYS.scatterplot.includes(mapGroupKey)) {
            if (d[lat] && d[lon]) {
              return d
            }
            const { [lat]: [_lat], [lon]: [_lon] } = groupedData[d[formattedColumnNames[mapGroupKey]]]
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
  }, [type, aggregatedData, columns, mapGroupKey, groupedData, formattedColumnNames])

  // simply format and sort data if grouping is not enabled
  const indexedData = useMemo(() => {
    if (group) return null
    const sortFn = domainIsDate
      ? (a, b) => dateSort(a[formattedColumnNames[indexKey]], b[formattedColumnNames[indexKey]])
      : (a, b) => (a[formattedColumnNames[indexKey]] - b[formattedColumnNames[indexKey]])
    return (
      truncatedData
        .map(d => Object.fromEntries(
          Object.entries(d)
            .map(
              ([k, v]) => [formattedColumnNames[k], v]
            )
        ))
        .sort(sortFn)
    )
  }, [domainIsDate, formattedColumnNames, group, indexKey, truncatedData])

  // memoize the final data processing according to whether grouping is enabled
  const finalData = useMemo(() => {
    if (type === types.MAP) {
      return mapEnrichedData
    }
    if (group) {
      return percentageMode ? percentageData : aggregatedData
    }
    return indexedData
  }, [aggregatedData, group, indexedData, mapEnrichedData, percentageData, percentageMode, type])

  useEffect(() => {
    update({ transformedData: finalData })
  }, [finalData, update])
}

export default useTransformedData
