import { useStoreState } from 'easy-peasy'


export const useSavedQueriesStates = (_actions) => {
  /* -- Saved Queries States -- */
  const modelReset = useStoreState((state) => state.queries.modelReset)
  const selectedQuery = useStoreState((state) => state.queries.selectedQuery)
  const executionParams = useStoreState((state) => state.queries.executionParams)

  const error = useStoreState((state) => state.queries.saveModal.error)
  const open = useStoreState((state) => state.queries.saveModal.open)
  const name = useStoreState((state) => state.queries.saveModal.name)
  const description = useStoreState((state) => state.queries.saveModal.description)
  const saveExecution = useStoreState((state) => state.queries.saveModal.saveExecution)
  const resetAlert = useStoreState((state) => state.queries.saveModal.resetAlert)
  const unsavedAlert = useStoreState((state) => state.queries.saveModal.unsavedAlert)
  const deleteAlert = useStoreState((state) => state.queries.saveModal.deleteAlert)
  const exeCancelAlert = useStoreState((state) => state.queries.saveModal.exeCancelAlert)

  const savedQueries = useStoreState((state) => state.queries.qlSavedQueries.savedQueries)
  const savedQueriesLoading = useStoreState((state) => state.queries.qlSavedQueries.savedQueriesLoading)
  const savedQuery = useStoreState((state) => state.queries.qlSavedQueries.savedQuery)
  const savedQueryLoading = useStoreState((state) => state.queries.qlSavedQueries.savedQueryLoading)
  const queryMutations = useStoreState((state) => state.queries.qlSavedQueries.queryMutations)

  const queryExecutions = useStoreState((state) => state.queries.qlExecutionHistory.queryExecutions)
  const executionLoading = useStoreState((state) => state.queries.qlExecutionHistory.executionLoading)
  const showAll = useStoreState((state) => state.queries.qlExecutionHistory.showAll)
  const filterConfig = useStoreState((state) => state.queries.qlExecutionHistory.filterConfig)
  const executionMutations = useStoreState((state) => state.queries.qlExecutionHistory.executionMutations)
  /* -- Saved Queries States -- */

  return {
    modelReset,
    selectedQuery,
    executionParams,
    ..._actions.queries,

    saveModal: {
      error,
      open,
      name,
      description,
      saveExecution,
      resetAlert,
      unsavedAlert,
      deleteAlert,
      exeCancelAlert,
      ..._actions.queries.saveModal,
    },

    qlSavedQueries: {
      savedQueries,
      savedQueriesLoading,
      savedQuery,
      savedQueryLoading,
      ..._actions.queries.qlSavedQueries,
      queryMutations: {
        ...queryMutations,
        ..._actions.queries.qlSavedQueries.queryMutations,
      }
    },

    qlExecutionHistory: {
      queryExecutions,
      executionLoading,
      showAll,
      filterConfig,
      ..._actions.queries.qlExecutionHistory,
      executionMutations: {
        ...executionMutations,
        ..._actions.queries.qlExecutionHistory.executionMutations,
      },
    },
  }
}
