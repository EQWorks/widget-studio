import React, { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useResizeDetector } from 'react-resize-detector'
import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreState } from '../../store'
import PlotlyAdapters from './adapters/chart-system/plotly'
import MapAdapter from './adapters/react-maps'


const classes = makeStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
})

// declare which adapter handles each widget type
const adapterDict = {
  bar: PlotlyAdapters.bar,
  pie: PlotlyAdapters.pie,
  scatter: PlotlyAdapters.scatter,
  line: PlotlyAdapters.line,
  map: MapAdapter,
}

// validate each used adapter according to { component, adapt } schema
Object.entries(adapterDict).forEach(([key, adapter]) => {
  PropTypes.checkPropTypes(
    {
      component: PropTypes.elementType.isRequired,
      adapt: PropTypes.func.isRequired,
    },
    adapter,
    'property',
    `adapterDict.${key}`
  )
})

const WidgetAdapter = () => {
  // state
  const type = useStoreState((state) => state.type)
  const config = useStoreState((state) => state.config)
  const transformedData = useStoreState((state) => state.transformedData)
  const { ref, width, height } = useResizeDetector()

  // memoize the correct adapter
  const { component, adapt } = useMemo(() => adapterDict[type], [type])

  // pass the processed data to the rendering adapter and memoize the results
  const adaptedDataAndConfig = useMemo(() => adapt(transformedData ?? [], config), [adapt, config, transformedData])

  // render the component
  return (
    <div ref={ref} className={classes.container} >
      {createElement(component, { width, height, ...adaptedDataAndConfig }
      )}
    </div>
  )
}

export default WidgetAdapter

