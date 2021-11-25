import { useEffect, useMemo } from 'react'

import { useStoreActions, useStoreState } from '../store'
import aggFunctions from '../util/agg-functions'


const useTransformedData = () => {

  // actions
  const update = useStoreActions((state) => state.update)

  // state
  const rows = useStoreState((state) => state.rows)
  const filters = useStoreState((state) => state.filters)
  const indexKey = useStoreState((state) => state.indexKey)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const group = useStoreState((state) => state.group)
  const groupKey = useStoreState((state) => state.groupKey)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)

  // truncate the data when the filters change
  const truncatedData = useMemo(() => (
    rows.filter(obj => {
      for (const [key, [min, max]] of Object.entries(filters).filter(([k]) => k !== groupKey)) {
        if (obj[key] < min || obj[key] > max) {
          return false
        }
      }
      return true
    })
  ), [rows, filters, groupKey])

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

  // memoize names of groups produced by the current grouping
  useEffect(() => {
    if (groupedData) {
      update({ groups: Object.keys(groupedData) })
    }
  }, [groupedData, update])

  // determine whether the configured group key has produced data with any variance, relay to global state
  useEffect(() => {
    if (groupedData) {
      const data = Object.values(groupedData)
      if (data[0]) {
        const testKey = Object.keys(data[0])[0]
        update({ dataHasVariance: data.some(g => g[testKey].length > 1) })
      }
    }
  }, [update, groupedData])

  // if a filter on the groupKey exists, retain only the desired groups
  const filteredGroupedData = useMemo(() => (
    group
      ? filters[groupKey]?.length
        ? Object.fromEntries(Object.entries(groupedData).filter(([k]) => filters[groupKey].includes(k)))
        : groupedData
      : null
  ), [filters, group, groupKey, groupedData])

  // if grouping enabled, aggregate each column from renderableValueKeys in groupedData according to defined 'agg' property
  const aggregatedData = useMemo(() => (
    group
      ? Object.entries(filteredGroupedData).map(([_groupKey, values]) => (
        renderableValueKeys.reduce((res, { key, agg }) => {
          res[`${key}_${agg}`] = dataHasVariance
            ? aggFunctions[agg](values[key])
            : values[key][0]
          return res
        }, { [groupKey]: _groupKey })
      ))
      : null
  ), [dataHasVariance, filteredGroupedData, group, groupKey, renderableValueKeys])

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
