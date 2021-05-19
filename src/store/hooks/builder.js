import { useStoreState } from 'easy-peasy'


export const useBuilderStates = (_actions) => {
  /* --  Views reducer + MLViews -- */
  const views = useStoreState((state) => state.builder.views)
  const viewColorMap = useStoreState((state) => state.builder.viewColorMap)
  const MLViews = useStoreState((state) => state.builder.MLViews)
  const QLViews = useStoreState((state) => state.builder.QLViews)
  const MLViewCols = useStoreState((state) => state.builder.MLViewCols)
  const viewsLoading = useStoreState((state) => state.builder.viewsLoading)
  const viewColsLoading = useStoreState((state) => state.builder.viewColsLoading)
  const viewsControlStates = useStoreState((state) => state.builder.viewTypeChangeControls)

  const viewCategories = useStoreState((state) => state.builder.viewCategories)
  const selectedNodes = useStoreState((state) => state.builder.selectedNodes)
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
    viewsControlStates,
    QLViews,
    MLViews,
    MLViewCols,
    viewsLoading,
    viewColsLoading,

    viewCategories,
    selectedNodes,

    /* -- filters -- */
    filters,

    /* -- columns -- */
    columns,

    /* -- results -- */
    resultState,

    ..._actions.builder,
  }
}
