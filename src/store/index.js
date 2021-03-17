import { createStore, action } from 'easy-peasy'

import { viewsReducer } from './views-reducer'


const _action = (key) => action((state, payload) => { state[key] = payload })

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

  // // resultReducer
  // results: [],
  // queryString: '',
  // proMode: false,
  // isPreview: false,
  // shouldFetch: false,
  // model: {},
  // //
  // customerID: -1,
  // whitelabelID: -1,
  // queryHash: '',
  // columnHash: '',
  // resultColumns: [], // from columns
  // cost: 1,
  // executionID: -1,
  // isInternal: false,
  // isOrphaned: false,
  // markup: { query: {}, views: [] },
  // queryID: -1,
  // status: '',
  // statusTS: '',
}, {
  disableImmer: true,
})
