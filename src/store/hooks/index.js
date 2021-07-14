import { useStoreState, useStoreActions, useStoreDispatch } from 'easy-peasy'

export const useWidgetsStore = () => {
  const access = useStoreState((state) => state.access)
  const queryDrawer = useStoreState((state) => state.queryDrawer)
  const mode = useStoreState((state) => state.mode)
  const alert = useStoreState((state) => state.alert)


  const _actions = useStoreActions((actions) => actions)
  /* -- dispatch -- */
  const qlModelDispatch = useStoreDispatch()

  return {
    access,
    queryDrawer,
    mode,
    alert,

    setAccess: _actions.setAccess,
    setAlert: _actions.setAlert,
    setMode: _actions.setMode,
    setQueryDrawer: _actions.setQueryDrawer,

    widgets: { ..._actions.widgets },

    qlModelDispatch,
  }
}
