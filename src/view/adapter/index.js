import { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useStoreState } from '../../store'
import PlotlyAdapters from './adapters/chart-system/plotly'
import MapAdapter from './adapters/react-maps'


// declare which adapter handles each widget type
const adapterDict = {
  bar: PlotlyAdapters.bar,
  pie: PlotlyAdapters.pie,
  scatter: PlotlyAdapters.scatter,
  line: PlotlyAdapters.line,
  map: MapAdapter,
}

// validate each used adapter according to { component, adapt } schema
Object.entries(adapterDict).forEach(([key, adapter]) => {
  PropTypes.checkPropTypes(
    {
      component: PropTypes.elementType.isRequired,
      adapt: PropTypes.func.isRequired,
    },
    adapter,
    'property',
    `adapterDict.${key}`
  )
})

// define various aggregation functions for use when data is grouped
// TODO median/mode, std, var
export const aggFuncDict = {
  sum: arr => arr.reduce((a, b) => a + b, 0),
  product: arr => arr.reduce((a, b) => a * b, 1),
  mean: arr => arr.reduce((p, c, i) => p + (c - p) / (i + 1), 0),
  min: Math.min,
  max: Math.max,
  count: arr => arr.filter(d => d || d === 0).length,
  unique: arr => (new Set(arr)).size,
}

const WidgetAdapter = ({ width, height }) => {
  const rows = useStoreState((state) => state.rows)
  const type = useStoreState((state) => state.type)
  const filters = useStoreState((state) => state.filters)
  const indexKey = useStoreState((state) => state.indexKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const config = useStoreState((state) => state.config)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)

  // record the correct adapter for use later (after data processing)
  const { component, adapt } = useMemo(() => adapterDict[type], [type])

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

  // if grouping enabled, memoize grouped and reorganized version of data that will be easy to aggregate
  const groupedData = useMemo(() => (
    group
      ? truncatedData.reduce((res, r) => {
        const group = r[groupKey]
        res[group] = res[group] || {}
        Object.entries(r).forEach(([k, v]) => {
          if (k !== groupKey) {
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
  ), [group, groupKey, truncatedData])

  // if grouping enabled, aggregate each column from valueKeys in groupedData according to defined 'agg' property
  const aggregatedData = useMemo(() => (
    group
      ? Object.entries(groupedData).map(([_groupKey, values]) => (
        valueKeys.reduce((res, { key, agg = 'sum' }) => {
          res[`${key}_${agg}`] = aggFuncDict[agg](values[key])
          return res
        }, { [groupKey]: _groupKey })
      ))
      : null
  ), [group, groupKey, groupedData, valueKeys])

  const mapEnrichedData = useMemo(() => (
    type === 'map'
      ? aggregatedData.map((d) => {
        //---TODO - Erika: refactor this to include all types of coord keys
        // add coordinates for map widget data
        if (d.lat && d.lon) {
          return d
        }
        const { lat: [_lat], lon: [_lon] } = groupedData[d[groupKey]]
        return {
          ...d,
          lat: _lat,
          lon: _lon,
        }
      })
      : null
  ), [aggregatedData, groupKey, groupedData, type])

  // simply sort the data if grouping is not enabled
  const indexedData = useMemo(() => (
    !group
      ? truncatedData.sort((a, b) => a[indexKey] - b[indexKey])
      : null
  ), [group, indexKey, truncatedData])

  // memoize the final data processing according to whether grouping is enabled
  const finalData = useMemo(() => (
    type === 'map'
      ? mapEnrichedData
      : group
        ? aggregatedData
        : indexedData
  ), [aggregatedData, group, indexedData, mapEnrichedData, type])

  // pass the processed data to the rendering adapter and memoize the results
  const adaptedDataAndConfig = useMemo(() => adapt(finalData ?? [], config), [adapt, config, finalData])

  // render the component
  return createElement(component, { width, height, ...adaptedDataAndConfig })
}

export default WidgetAdapter

WidgetAdapter.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

WidgetAdapter.defaultProps = {
  width: 0,
  height: 0,
}
