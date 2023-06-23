import { useStoreState } from '../store'
import types from '../constants/types'

/**
 * useGroupFilterValue - determines the value of group filter in the CustomSelect and for percentage
 *                       calculations for Stat widget
 * Logic:
 *  a. default value for Stat Widget is always first element in groups list as Stat widget always
 *     requires a group filter value in CustomSelect component
 *  b. otherwise, the filter value is the groupFilter list
 *  c. we reset the group filter value when we change widget type so we don't create confusion
 */
export const useGroupFilterValue = () => {
  const groups = useStoreState((state) => state.groups)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const type = useStoreState((state) => state.type)

  if (type === types.STAT) {
    let _groupFilter = groupFilter[0] ? groupFilter : groups
    return [_groupFilter[0] ?? '']
  }
  return groupFilter ?? []
}
