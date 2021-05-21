import { action } from 'easy-peasy'


export const _action = (key) => action((state, payload) => {
  let _payload = payload
  if (typeof payload === 'function') {
    _payload = payload(state[key])
  }
  return { ...state, [key]: _payload }
})

export const findNodes = (categories = [], targetID, parents = []) => (
  categories.map(({ id, name, children }) => {
    if (targetID === id) {
      return [...parents, { id, name }]
    }
    return findNodes(children, targetID, [...parents, { id, name }])
  })).flat()
