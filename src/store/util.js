import { isObject } from '../util'


export const deepMerge = (p, stateToModify) => (
  Object.entries(p).reduce((acc, [k, v]) => {
    acc[k] = isObject(v)
      ? deepMerge(v, stateToModify[k])
      : v
    return acc
  }, { ...stateToModify })
)
