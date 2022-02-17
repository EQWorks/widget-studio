import React, { createElement, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useResizeDetector } from 'react-resize-detector'
import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreState } from '../../store'
import typeInfo from '../../constants/type-info'


const classes = makeStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
})

// validate each used adapter according to { component, adapt } schema
Object.entries(typeInfo).forEach(([key, { adapter }]) => {
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
  const { ref, width, height } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
  })


  // memoize the correct adapter
  const { component, adapt } = useMemo(() => typeInfo[type].adapter, [type])

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
