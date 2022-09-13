import { useEffect, useMemo, useCallback } from 'react'

import { useStoreActions, useStoreState } from '../store'
import aggFunctions from '../util/agg-functions'
import { getRegionPolygons } from '../util/api'
import {
  COORD_KEYS,
  MAP_LAYER_GEO_KEYS,
  GEO_KEY_TYPES,
  GEO_KEY_TYPE_NAMES,
} from '../constants/map'
import types from '../constants/types'
import { roundToTwoDecimals } from '../util/numeric'
import { xwiAggData } from '../util/agg-map-xwi'
import { latIsValid, lonIsValid, geoKeyIsValid } from '../util/geo-validation'
import { dateAggregations, dateSort } from '../constants/time'
import { columnTypes } from '../constants/columns'
import { YYYYMMDDToDate } from '../util/time'


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
  const domainIsDate = useStoreState((state) => state.domainIsDate)
  const dateAggregation = useStoreState((state) => state.dateAggregation)
  const propFilters = useStoreState((state) => state.propFilters)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)

  const dataKeys = useMemo(() => Object.keys(columnsAnalysis || {}), [columnsAnalysis])

  const finalGroupKey = useMemo(() => {
    const sourcePOIId = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.scatterplot.includes(key))
    if (type === types.MAP) {
      // TO CHANGE: temporary workaround to enable one domain filter for xwi report
      if (dataIsXWIReport) {
        return sourcePOIId
      }
      return mapGroupKey
    }
    return groupKey
  }, [dataKeys, type, dataIsXWIReport, mapGroupKey, groupKey])

  // normalize data using columnsAnalysis (ex. price to numeric)
  const normalizedData = useMemo(() => {
    const normalizedColumns = Object.entries(columnsAnalysis).filter(([, { normalized }]) => normalized)
    return normalizedColumns.length
      ? normalizedColumns.reduce((acc, [c, { normalized }]) => {
        acc.forEach((r, i) => {
          r[c] = normalized[i]
        })
        return acc
      }, [...rows])
      : rows
  }, [columnsAnalysis, rows])

  // truncate the data when the filters change
  const truncatedData = useMemo(() => {
    const allFilters = [
      ...(filters?.length ? filters : []),
      ...(propFilters?.length ? propFilters : []),
    ]
    if (!allFilters.length) {
      return normalizedData
    }
    return normalizedData.filter(obj => {
      for (const { key, filter } of allFilters.filter(({ filter }) => filter)) {
        switch (columnsAnalysis[key]?.category) {
          case columnTypes.NUMERIC:
          case columnTypes.PRICE:
            if (obj[key] < filter[0] || obj[key] > filter[1]) {
              return false
            }
            break
          case columnTypes.STRING:
            if (!filter.includes(obj[key])) {
              return false
            }
            break
          default:
            return true
        }
      }
      return true
    })
  }, [filters, propFilters, normalizedData, columnsAnalysis])

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
        let group = groupFSAByPC ? r[newGroupKey]?.trim().slice(0, 3) : r[newGroupKey]
        // eliminate spaces from polygon geo key values
        if (MAP_LAYER_GEO_KEYS.geojson.includes(newGroupKey)) {
          group = group.replace(' ', '')
        }
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
        const testKey = Object.keys(data[0]).find(key => columnsAnalysis[key].isNumeric)
        update({ dataHasVariance: data.some(g => g[testKey]?.length > 1) })
      }
    }
  }, [dataKeys, update, groupedData, columnsAnalysis])

  // if a filter on the finalGroupKey exists, retain only the desired groups
  const filteredGroupedData = useMemo(() => {
    if (!group) {
      return null
    }
    if (!groupFilter?.length) {
      return groupedData
    }
    if (domainIsDate) {
      const [min, max] = groupFilter.map(YYYYMMDDToDate)
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
    if (!group || (type === types.MAP && dataIsXWIReport)) return null
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
        ...Object.fromEntries(renderableValueKeys.map(({ key, agg = 'sum', title }) => (
          [title, aggFunctions[agg](v.map(_v => _v[key]).flat())]
        ))),
      })).sort((a, b) => sortFn(a[formattedDomain], b[formattedDomain]))
    }
    return Object.entries(filteredGroupedData).map(([group, values]) => {
      const res = renderableValueKeys.reduce((res, { key, agg, title }) => {
        const val = dataHasVariance
          ? aggFunctions[agg](values[key])
          : values?.[key]?.[0]
        res[title] = val
        return res
      }, { [formattedDomain]: group })
      return res
    })
  }, [
    group,
    type,
    dataIsXWIReport,
    domainIsDate,
    formattedColumnNames,
    dateAggregation,
    filteredGroupedData,
    renderableValueKeys,
    finalGroupKey,
    dataHasVariance,
  ])

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

  // special aggregation case for xwi report data to be used in map widget
  const formatXWIReportData = useMemo(() => {
    if (type && type === types.MAP && dataIsXWIReport && truncatedData?.length) {
      const sourcePOIId = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.scatterplot.includes(key))
      const targetPOIId = dataKeys?.find(key => MAP_LAYER_GEO_KEYS.targetScatterplot.includes(key))
      const [arcData, sourceData, targetData] =
        [[sourcePOIId, targetPOIId], sourcePOIId, targetPOIId].map((groupKey) =>
          xwiAggData({
            data: truncatedData,
            groupKey,
            sourcePOIId,
            targetPOIId,
            columnsAnalysis,
            formattedColumnNames,
            groupFilter,
          }))
      return { arcData, sourceData, targetData }
    }
    return {}
  }, [
    type,
    dataIsXWIReport,
    truncatedData,
    columnsAnalysis,
    dataKeys,
    formattedColumnNames,
    groupFilter,
  ])

  // enrich data with coords for scatterplot & geojson data; special aggregation for xwi-reports
  const getMapEnrichedData = useCallback(async () => {
    if ( type && type === types.MAP && !dataIsXWIReport) {
      // add coordinates for map widget data
      if (MAP_LAYER_GEO_KEYS.scatterplot.includes(mapGroupKey)) {
        const lat = columns.find(({ name, category }) =>
          COORD_KEYS.latitude.includes(name) && category === columnTypes.NUMERIC)?.name
        const lon = columns.find(({ name, category }) =>
          COORD_KEYS.longitude.includes(name) && category === columnTypes.NUMERIC)?.name
        return aggregatedData.reduce((acc, d) => {
          if (lat && lon) {
            if (latIsValid(d[lat]) && lonIsValid(d[lon])) {
              return [...acc, d]
            }
            const { [lat]: [_lat], [lon]: [_lon] } = groupedData[d[formattedColumnNames[mapGroupKey]]]
            return latIsValid(_lat) && lonIsValid(_lon) ?
              [
                ...acc,
                {
                  ...d,
                  lat: _lat,
                  lon: _lon,
                },
              ] :
              acc
          }
        }, [])
      }
      if (GEO_KEY_TYPES.region.includes(mapGroupKey)) {
        const formattedDomain = formattedColumnNames[mapGroupKey]
        const regions = Object.keys(filteredGroupedData).reduce((acc, region) =>
          geoKeyIsValid({ geoKey: GEO_KEY_TYPE_NAMES.region, d: region.toUpperCase().trim() }) ?
            [...acc, region.toUpperCase().trim()] :
            acc
        , [])
        let regionPolygons
        try {
          regionPolygons = await getRegionPolygons(regions)
          regionPolygons = regionPolygons?.flat().reduce((acc, region) => {
            acc = {
              ...acc,
              [region?.geometry?.name]: region.geometry,
            }
            return acc
          }, {})
        } catch (err) {
          console.error(err)
        }
        if (regionPolygons && aggregatedData.length) {
          return aggregatedData.reduce((acc, regionData) => {
            const regionName = regionData[formattedDomain].toUpperCase().trim()
            const { type, coordinates } = regionPolygons[regionName] || {}
            return regionPolygons[regionName] ?
              [
                ...acc,
                {
                  type: 'Feature',
                  geometry: {
                    type,
                    coordinates,
                  },
                  properties: regionData,
                },
              ] :
              acc
          }, [])
        }
        return []
      }
      if (MAP_LAYER_GEO_KEYS.geojson.includes(mapGroupKey)) {
        const geoKey = Object.keys(GEO_KEY_TYPES)
          .find(type => GEO_KEY_TYPES[type].includes(mapGroupKey))
        const formattedDomain = formattedColumnNames[mapGroupKey]
        return aggregatedData.reduce((acc, d) =>
          geoKeyIsValid({ geoKey, d: d[formattedDomain].replace(' ', '').toUpperCase() }) ?
            [
              ...acc,
              {
                ...d,
                formattedDomain: d[formattedDomain].replace(' ', '').toUpperCase(),
              },
            ] :
            acc
        , [])
      }
    }
    return null
  }, [
    type,
    dataIsXWIReport,
    aggregatedData,
    filteredGroupedData,
    columns,
    mapGroupKey,
    groupedData,
    formattedColumnNames,
  ])

  // simply format and sort data if grouping is not enabled
  const indexedData = useMemo(() => {
    if (group || dataIsXWIReport) return null
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
  }, [domainIsDate, formattedColumnNames, group, indexKey, truncatedData, dataIsXWIReport])

  // update transformedData
  useEffect(() => {
    if (type && rows.length) {
      if (type === types.MAP) {
        if (dataIsXWIReport) {
          update({ transformedData: formatXWIReportData })
        } else {
          getMapEnrichedData()
            .then(data => update({ transformedData: data }))
            .catch(err => console.error(err))
        }
      } else if (group) {
        if(percentageMode) {
          update({ transformedData: percentageData })
        } else {
          update({ transformedData: aggregatedData })
        }
      } else {
        update({ transformedData: indexedData })
      }
    }
  }, [
    type,
    rows,
    dataIsXWIReport,
    formatXWIReportData,
    getMapEnrichedData,
    update,
    group,
    percentageMode,
    percentageData,
    aggregatedData,
    indexedData,
  ])
}

export default useTransformedData
