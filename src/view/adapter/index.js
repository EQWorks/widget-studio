import React, { useState, useEffect, createElement, useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useTransformedData from '../../hooks/use-transformed-data'
import { useStoreState } from '../../store'
import PlotlyAdapters from './adapters/chart-system/plotly'
import { useResizeDetector } from 'react-resize-detector'
import MapAdapter from './adapters/map'


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
  const { ref, width, height } = useResizeDetector()
  const [delayedSize, setDelayedSize] = useState({ width, height })
  const [sizeChanging, setSizeChanging] = useState(false)
  const [hide, setHide] = useState(false)
  const sizeRef = React.useRef(null)

  // smooth transitions when resizing
  useEffect(() => {
    // log the current container size
    sizeRef.current = { width, height }
    // initialize the debounced size if not already
    if (!delayedSize.width) {
      return setDelayedSize(sizeRef.current)
    }
    // assume the container is "being resized" for the next 400ms
    setSizeChanging(true)
    setTimeout(() => {
      setSizeChanging(false)
    }, 400)
    // 200ms from now, hide the container if the container is done resizing
    setTimeout(() => {
      if (!sizeChanging) {
        setHide(true)
        setTimeout(() => {
          setHide(false)
        }, 300)
      }
    }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width])

  // resize the actual viz while the container is hidden
  useEffect(() => {
    if (hide) {
      setTimeout(() => {
        setDelayedSize(sizeRef.current)
      }, 200)
    } else {
      if (!sizeChanging) {
        setDelayedSize(sizeRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hide])

  // render the component
  return (
    <div ref={ref} className='relative h-full flex justify-center'>
      <div
        style={{ width: delayedSize.width, height: delayedSize.height }}
        className={clsx('absolute transition-opacity duration-200 ease-in-out', {
          'opacity-0': hide || !delayedSize?.width,
          'opacity-1': !hide,
        })}
      >
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
