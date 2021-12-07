import { useEffect, useMemo } from 'react'

import { useStoreActions, useStoreState } from '../store'

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

const useTransformedData = () => {

  // actions
  const update = useStoreActions((state) => state.update)

  // state
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)
  const filters = useStoreState((state) => state.filters)
  const indexKey = useStoreState((state) => state.indexKey)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)

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

  // compute list of columns that have 0 variance
  const zeroVarianceColumns = useMemo(() => (
    group
      ? columns.map(({ name }) => name).filter(c => (
        c !== groupKey &&
        Object.values(groupedData).every(d => {
          return d[c].length === 1
        })))
      : []
  ), [columns, group, groupKey, groupedData])

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
            ? values[key]
            : aggFuncDict[agg](values[key])
          return res
        }, { [groupKey]: _groupKey })
      ))
      : null
  ), [group, groupKey, groupedData, renderableValueKeys, zeroVarianceColumns])

  // simply sort the data if grouping is not enabled
  const indexedData = useMemo(() => (
    !group
      ? truncatedData.sort((a, b) => a[indexKey] - b[indexKey])
      : null
  ), [group, indexKey, truncatedData])

  // memoize the final data processing according to whether grouping is enabled
  const finalData = useMemo(() => (
    group
      ? aggregatedData
      : indexedData
  ), [aggregatedData, group, indexedData])

  return finalData
}

export default useTransformedData
