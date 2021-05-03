import { useStoreState, useStoreActions, useStoreDispatch } from 'easy-peasy'

import { useBuilderStates } from './builder'
import { useSavedQueriesStates } from './saved-queries'


export const useQLStore = () => {
  const access = useStoreState((state) => state.access)
  const queryDrawer = useStoreState((state) => state.queryDrawer)
  const mode = useStoreState((state) => state.mode)
  const alert = useStoreState((state) => state.alert)


  const _actions = useStoreActions((actions) => actions)
  /* -- dispatch -- */
  const viewDispatch = useStoreDispatch()

  /* -- hooks -- */
  const builder = useBuilderStates(_actions)
  const savedQueries = useSavedQueriesStates(_actions)

  return {
    access,
    queryDrawer,
    mode,
    alert,

    setAccess: _actions.setAccess,
    setAlert: _actions.setAlert,
    setMode: _actions.setMode,
    setQueryDrawer: _actions.setQueryDrawer,

    builder,
    savedQueries,

    widgets: { ..._actions.widgets },

    viewDispatch,
    resultDispatch: viewDispatch,
  }
}
