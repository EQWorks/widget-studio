import { useStoreState } from 'easy-peasy'


export const useBuilderStates = (_actions) => {
  /* --  Views reducer + MLViews -- */
  const views = useStoreState((state) => state.builder.views)
  const viewColorMap = useStoreState((state) => state.builder.viewColorMap)
  const MLViews = useStoreState((state) => state.builder.MLViews)
  const MLViewCols = useStoreState((state) => state.builder.MLViewCols)
  const viewsLoading = useStoreState((state) => state.builder.viewsLoading)
  const subViewsLoading = useStoreState((state) => state.builder.subViewsLoading)
  const columnsLoading = useStoreState((state) => state.builder.columnsLoading)
  const viewState = useStoreState((state) => state.builder.viewState)
  const viewsControlStates = useStoreState((state) => state.builder.viewTypeChangeControls)
  const subViewIndex = useStoreState((state) => state.builder.subViewIndex)

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
    viewState,
    subViewIndex,
    viewsControlStates,
    MLViews,
    MLViewCols,
    viewsLoading,
    subViewsLoading,
    columnsLoading,

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
