import { createStore, thunkOn } from 'easy-peasy'

import { builder } from './builder'
import { widgetsReducer } from './widgets-reducer'
import { savedQueriesStates } from './saved-queries'
import { _action } from './store-util'


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
        actions.builder.viewTypeControlsReset()
        actions.builder.handleViewsDispatch({
          type: 'NEW_ACCESS',
          payload: {},
        })
      }
    }
  ),

  // query builder
  builder,

  // saved queries
  savedQueries: { ...savedQueriesStates },

  // widgets
  widgets: widgetsReducer
}, {
  disableImmer: true,
})
