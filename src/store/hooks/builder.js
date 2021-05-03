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
  /* -- filters -- */
  const filters = useStoreState((state) => state.builder.filters)

  /* -- columns -- */
  const columns = useStoreState((state) => state.builder.columns)
  const geoJoinColumn = useStoreState((state) => state.builder.geoJoinColumn)

  /* -- results reducer -- */
  const resultState = useStoreState((state) => state.builder.resultState)

  return {
    /* -- views -- */
    views,
    viewColorMap,
    viewState,
    viewsControlStates,
    MLViews,
    MLViewCols,
    viewsLoading,
    subViewsLoading,
    columnsLoading,

    /* -- filters -- */
    filters,

    /* -- columns -- */
    columns,
    geoJoinColumn,

    /* -- results -- */
    resultState,

    ..._actions.builder,
  }
}
