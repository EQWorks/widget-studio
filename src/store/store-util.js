import { action } from 'easy-peasy'


export const _action = (key) => action((state, payload) => {
  let _payload = payload
  if (typeof payload === 'function') {
    _payload = payload(state[key])
  }
  return { ...state, [key]: _payload }
})
