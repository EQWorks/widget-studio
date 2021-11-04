import React, { useState, useEffect, createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import useTransformedData from '../../hooks/use-transformed-data'
import { useStoreState } from '../../store'
import PlotlyAdapters from './adapters/chart-system/plotly'
import useDebouncedResizeObserver from '../../hooks/use-debounced-resize-observer'
import MapAdapter from './adapters/react-maps'


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
  const transformedData = useTransformedData()

  // record the correct adapter for use later (after data processing)
  const { component, adapt } = useMemo(() => adapterDict[type], [type])

  // pass the processed data to the rendering adapter and memoize the results
  const adaptedDataAndConfig = useMemo(() => adapt(transformedData ?? [], config), [adapt, config, transformedData])

  // debounce component resizing to improve performance
  const { size, ref } = useDebouncedResizeObserver(20)

  // smooth transitions when resizing
  const [delayedSize, setDelayedSize] = useState({})
  const [hide, setHide] = useState(false)
  useEffect(() => {
    setHide(true)
    setTimeout(() => {
      setDelayedSize(size)
      setTimeout(() => setHide(false), 400)
    }, 300)
  }, [size])

  // render the component
  return (
    <div ref={ref} className='h-full flex justify-center'>
      <div style={{ width: delayedSize.width, height: delayedSize.height }} className={`transition-opacity duration-300 ease-in-out ${hide || !delayedSize.width ? 'opacity-0' : 'opacity-1'}`}>
        {createElement(component, { width: delayedSize.width, height: delayedSize.height, ...adaptedDataAndConfig })}
      </div>
    </div>
  )
}

export default WidgetAdapter

WidgetAdapter.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

WidgetAdapter.defaultProps = {
  width: 0,
  height: 0,
}
