import { createStore, action } from 'easy-peasy'

import { viewsReducer } from './views-reducer'
import { resultsReducer } from './results-reducer'


const _action = (key) => action((state, payload) => {
  let _payload = payload
  if (typeof payload === 'function') {
    _payload = payload(state[key])
  }
  return { ...state, [key]: _payload }
})

export const store = createStore({
  queryDrawer: true,
  setQueryDrawer: _action('queryDrawer'),
  mode: { edit: true, read: false, isEditing: -1 },
  setMode: _action('mode'),
  columns: [],
  setColumns: _action('columns'),
  filters: [],
  setFilters: _action('filters'),
  views: {},
  setViews: _action('views'),
  viewColorMap: {},
  setColorMap: _action('viewColorMap'),
  geoJoinColumn: {},
  setGeoJoinColumn: _action('geoJoinColumn'),
  alert: { status: false, message: 'Error' },
  setAlert: _action('alert'),

  // viewState
  ...viewsReducer,

  // resultReducer
  ...resultsReducer,

}, {
  disableImmer: true,
})
