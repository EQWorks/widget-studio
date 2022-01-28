import React, { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreState } from '../../store'
import PlotlyAdapters from './adapters/chart-system/plotly'


const classes = makeStyles({
  container: {
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

  // memoize the correct adapter
  const { component, adapt } = useMemo(() => adapterDict[type], [type])

  // pass the processed data to the rendering adapter and memoize the results
  const adaptedDataAndConfig = useMemo(() => adapt(transformedData ?? [], config), [adapt, config, transformedData])

  // render the component
  return (
    <div className={classes.container} >
      {createElement(component, adaptedDataAndConfig)}
    </div>
  )
}

export default WidgetAdapter
