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
  const qlModelDispatch = useStoreDispatch()

  /* -- hooks -- */
  const builder = useBuilderStates(_actions)
  const queries = useSavedQueriesStates(_actions)

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
    queries,

    widgets: { ..._actions.widgets },

    qlModelDispatch,
  }
}
