import { useStoreState } from 'easy-peasy'


export const useBuilderStates = (_actions) => {
  /* --  Views reducer -- */
  const views = useStoreState((state) => state.builder.views)
  const viewColorMap = useStoreState((state) => state.builder.viewColorMap)
  const QLViews = useStoreState((state) => state.builder.QLViews)
  const viewCategories = useStoreState((state) => state.builder.viewCategories)
  const selectedNodes = useStoreState((state) => state.builder.selectedNodes)
  const viewsLoading = useStoreState((state) => state.builder.viewsLoading)
  const viewColsLoading = useStoreState((state) => state.builder.viewColsLoading)
  const viewsWithAggCols = useStoreState((state) => state.builder.viewsWithAggCols)
  const viewSelectionState = useStoreState((state) => state.builder.viewSelectionState)

  /* -- filters -- */
  const filters = useStoreState((state) => state.builder.filters)

  /* -- columns -- */
  const columns = useStoreState((state) => state.builder.columns)

  /* -- results reducer -- */
  const resultState = useStoreState((state) => state.builder.resultState)

  return {
    /* -- views -- */
    views,
    viewColorMap,
    QLViews,
    selectedNodes,
    viewSelectionState,
    viewsLoading,
    viewColsLoading,
    viewsWithAggCols,
    viewCategories,

    /* -- filters -- */
    filters,

    /* -- columns -- */
    columns,

    /* -- results -- */
    resultState,

    ..._actions.builder,
  }
}
