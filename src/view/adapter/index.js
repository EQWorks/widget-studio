import React, { createElement, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useResizeDetector } from 'react-resize-detector'
import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../store'
import typeInfo from '../../constants/type-info'
import UserValueControls from '../../user-controls/user-value-controls'


const useStyles = (renderUserControlValues) => makeStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  widget: {
    // 64px is the height of the WidgetValueControls container
    height: renderUserControlValues ? 'calc(100% - 64px)' : '100%',
    padding: renderUserControlValues ? '1rem' : 0,
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
  const update = useStoreActions((actions) => actions.update)
  const type = useStoreState((state) => state.type)
  const config = useStoreState((state) => state.config)
  const transformedData = useStoreState((state) => state.transformedData)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const userControlHeadline = useStoreState((state) => state.userControlHeadline)
  const userControlKeyValues = useStoreState((state) => state.userControlKeyValues)
  const { ref, width, height } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
  })

  useEffect(() => {
    ref?.current && update({ ui: { screenshotRef: ref.current } })
  }, [ref, update])

  const renderUserControlValues = useMemo(() => Boolean(addUserControls &&
    (userControlHeadline || userControlKeyValues.length > 0))
  , [addUserControls, userControlHeadline, userControlKeyValues])

  const classes = useStyles(renderUserControlValues)

  // memoize the correct adapter
  const { component, adapt } = useMemo(() => typeInfo[type].adapter, [type])

  // pass the processed data to the rendering adapter and memoize the results
  const adaptedDataAndConfig = useMemo(() => adapt(transformedData ?? [], config)
    , [adapt, config, transformedData])

  // render the component
  return (
    <div ref={ref} className={classes.container} >
      {addUserControls && (userControlHeadline || userControlKeyValues.length > 0) &&
        <UserValueControls/>
      }
      <div className={classes.widget}>
        {/* 64 is the height of the WidgetValueControls container */}
        {createElement(component,
          { width, height: renderUserControlValues ? height - 64 : height, ...adaptedDataAndConfig }
        )}
      </div>
    </div>
  )
}

export default WidgetAdapter
