import { useStoreState } from 'easy-peasy'


export const useBuilderStates = (_actions) => {
  /* --  Views reducer + MLViews -- */
  const views = useStoreState((state) => state.builder.views.views)
  const viewColorMap = useStoreState((state) => state.builder.views.viewColorMap)
  const MLViews = useStoreState((state) => state.builder.views.MLViews)
  const MLViewCols = useStoreState((state) => state.builder.views.MLViewCols)
  const viewsLoading = useStoreState((state) => state.builder.views.viewsLoading)
  const subViewsLoading = useStoreState((state) => state.builder.views.subViewsLoading)
  const columnsLoading = useStoreState((state) => state.builder.views.columnsLoading)
  const viewState = useStoreState((state) => state.builder.views.viewState)
  const viewsControlStates = useStoreState((state) => state.builder.views.viewTypeChangeControls)

  /* -- results reducer -- */
  const resultState = useStoreState((state) => state.builder.results.resultState)

  /* -- columns -- */
  const columns = useStoreState((state) => state.builder.columns.columns)
  const geoJoinColumn = useStoreState((state) => state.builder.columns.geoJoinColumn)

  /* -- filters -- */
  const filters = useStoreState((state) => state.builder.filters.filters)

  return {
    views: {
      views,
      viewColorMap,
      viewState,
      viewsControlStates,
      // MLViews:
      MLViews,
      MLViewCols,
      viewsLoading,
      subViewsLoading,
      columnsLoading,
      ..._actions.builder.views,
    },
    columns: { columns, geoJoinColumn, ..._actions.builder.columns },
    filters: { filters, ..._actions.builder.filters },
    results: { resultState, ..._actions.builder.results },
    helpers: { ..._actions.builder.helpers }
  }
}
