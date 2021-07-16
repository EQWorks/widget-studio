import { createStore } from 'easy-peasy'

import { widgetsReducer } from './widgets-reducer'
import { _action } from './store-util'


export const store = createStore({
  mode: { edit: true, read: false, isEditing: -1 },
  alert: { status: false, message: 'Error' },

  setAccess: _action('access'),
  setQueryDrawer: _action('queryDrawer'),
  setMode: _action('mode'),
  setAlert: _action('alert'),

  widgets: widgetsReducer,
}, {
  disableImmer: true,
})
