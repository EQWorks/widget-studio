import { createStore, action, thunkOn } from 'easy-peasy'

import { viewsReducer } from './views-reducer'
import { widgetsReducer } from './widgets-reducer'
import { resultsReducer } from './results-reducer'
import { columnsActions } from './columns-actions'
import { filtersActions } from './filters-actions'
import { queryActionHelpers } from './query-action-helpers'

import { MLViews } from './api-actions/views'
import { savedQueriesStates } from './saved-queries'


const _action = (key) => action((state, payload) => {
  let _payload = payload
  if (typeof payload === 'function') {
    _payload = payload(state[key])
  }
  return { ...state, [key]: _payload }
})

export const store = createStore({
  access: { wl: '', cu: '' },
  queryDrawer: true,
  mode: { edit: true, read: false, isEditing: -1 },
  alert: { status: false, message: 'Error' },

  setAccess: _action('access'),
  setQueryDrawer: _action('queryDrawer'),
  setMode: _action('mode'),
  setAlert: _action('alert'),

  onWlCuChange: thunkOn(
    (actions) => actions.setAccess,
    (actions, { payload: { meta: { defaultView } } }) => {
      if (!defaultView.id) {
        actions.builder.helpers.reset()
        actions.savedQueries.reset()
        actions.builder.views.viewTypeControlsReset()
        actions.builder.views.handleViewsDispatch({
          type: 'NEW_ACCESS',
          payload: {},
        })
      }
    }
  ),

  // query builder
  builder: {
    views: {
      views: {},
      viewColorMap: {},
      setViews: _action('views'),
      setColorMap: _action('viewColorMap'),
      // api - useMLViews:
      ...MLViews,
      ...viewsReducer,
    },
    filters: {
      filters: [],
      setFilters: _action('filters'),
      ...filtersActions,
    },
    columns: {
      columns: [],
      geoJoinColumn: {},
      setColumns: _action('columns'),
      setGeoJoinColumn: _action('geoJoinColumn'),
      ...columnsActions,
    },
    helpers: { ...queryActionHelpers },
    results: { ...resultsReducer },
  },

  // saved queries
  savedQueries: { ...savedQueriesStates },

  // widgets
  widgets: widgetsReducer
}, {
  disableImmer: true,
})
