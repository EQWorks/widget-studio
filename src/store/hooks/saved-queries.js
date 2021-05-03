import { useStoreState } from 'easy-peasy'


export const useSavedQueriesStates = (_actions) => {
  /* -- Saved Queries States -- */
  const currentWL = useStoreState((state) => state.savedQueries.currentWL)
  const modelReset = useStoreState((state) => state.savedQueries.modelReset)
  const selectedQuery = useStoreState((state) => state.savedQueries.selectedQuery)
  const selectedExecution = useStoreState((state) => state.savedQueries.selectedExecution)
  const executionParams = useStoreState((state) => state.savedQueries.executionParams)

  const open = useStoreState((state) => state.savedQueries.saveModalStates.open)
  const name = useStoreState((state) => state.savedQueries.saveModalStates.name)
  const saveExecution = useStoreState((state) => state.savedQueries.saveModalStates.saveExecution)
  const unsavedAlert = useStoreState((state) => state.savedQueries.saveModalStates.unsavedAlert)
  const deleteAlert = useStoreState((state) => state.savedQueries.saveModalStates.deleteAlert)

  const savedQueries = useStoreState((state) => state.savedQueries.qlSavedQueries.savedQueries)
  const savedQueriesLoading = useStoreState((state) => state.savedQueries.qlSavedQueries.savedQueriesLoading)
  const savedQuery = useStoreState((state) => state.savedQueries.qlSavedQueries.savedQuery)
  const savedQueryLoading = useStoreState((state) => state.savedQueries.qlSavedQueries.savedQueryLoading)
  const queryMutations = useStoreState((state) => state.savedQueries.qlSavedQueries.queryMutations)

  const queryExecutions = useStoreState((state) => state.savedQueries.qlExecutionHistory.queryExecutions)
  const executionLoading = useStoreState((state) => state.savedQueries.qlExecutionHistory.executionLoading)
  const createExecution = useStoreState((state) => state.savedQueries.qlExecutionHistory.createExecution)
  /* -- Saved Queries States -- */

  return {
    currentWL,
    modelReset,
    selectedQuery,
    selectedExecution,
    executionParams,
    ..._actions.savedQueries,

    saveModalStates: {
      open,
      name,
      saveExecution,
      unsavedAlert,
      deleteAlert,
      ..._actions.savedQueries.saveModalStates,
    },

    qlSavedQueries: {
      savedQueries,
      savedQueriesLoading,
      savedQuery,
      savedQueryLoading,
      ..._actions.savedQueries.qlSavedQueries,
      queryMutations: {
        ...queryMutations,
        ..._actions.savedQueries.qlSavedQueries.queryMutations,
      }
    },

    qlExecutionHistory: {
      queryExecutions,
      executionLoading,
      createExecution,
      ..._actions.savedQueries.qlExecutionHistory,
    },
  }
}
