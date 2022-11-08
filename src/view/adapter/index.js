import React, { createElement, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useResizeDetector } from 'react-resize-detector'
import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../store'
import modes from '../../constants/modes'
import typeInfo from '../../constants/type-info'
import types from '../../constants/types'
import UserValueControls from '../../user-controls/user-value-controls'
import TopCategories from '../../user-controls/top-categories'


const useStyles = ({ type, renderUserControlValues, addTopCategories, topMargin }) => makeStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    marginTop: `${topMargin}rem`,
  },
  widget: {
    ...(addTopCategories && { display: 'flex' }),
    // 64px is the height of the WidgetValueControls container
    height: renderUserControlValues ? 'calc(100% - 64px)' : '100%',
    padding: renderUserControlValues && type !== types.MAP ? '1rem' : 0,
  },
  userValueDropdownSelect: {
    position: 'absolute',
    margin: '1rem 1rem 0rem 4rem',
    zIndex: '10',
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
  const mode = useStoreState(state => state.ui.mode)
  const config = useStoreState((state) => state.config)
  const transformedData = useStoreState((state) => state.transformedData)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const addTopCategories = useStoreState((state) => state.addTopCategories)
  const userControlKeyValues = useStoreState((state) => state.userControlKeyValues)
  const selectedUserDataControlIndex = useStoreState((state) => state.selectedUserDataControlIndex)
  const categoryKeyValues = useStoreState((state) => state.categoryKeyValues)
  const userValueDropdownSelect = useStoreState((state) => state.userValueDropdownSelect)
  const wl = useStoreState((state) => state.wl)
  const mapInitViewState = useStoreState((state) => state.mapInitViewState)
  const { onWidgetRender } = useStoreState((state) => state.ui)

  const { ref, width, height } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
  })

  useEffect(() => {
    ref?.current && update({ ui: { screenshotRef: ref.current } })
  }, [ref, update])

  const haveUserControls = useMemo(() => Boolean(addUserControls && userControlKeyValues?.length > 0 &&
    (type === types.BAR || (type === types.MAP && renderableValueKeys?.length === 1))),
  [addUserControls, userControlKeyValues, renderableValueKeys, type])

  const renderUserControlValues = useMemo(() => Boolean(addUserControls &&
    (userControlKeyValues.length > 0))
  , [addUserControls, userControlKeyValues])

  const MODE_DIMENSIONS = Object.freeze({
    [modes.EDITOR]: { marginTop: 0 },
    [modes.QL]: { marginTop: haveUserControls ? 0.75 : 0 },
    [modes.VIEW]: { marginTop: haveUserControls ? 0.75 : 0 },
    [modes.COMPACT]: { marginTop: 0 },
  })

  const classes = useStyles({
    type,
    renderUserControlValues,
    addTopCategories,
    topMargin: MODE_DIMENSIONS[mode].marginTop || 0,
  })

  // memoize the correct adapter
  const { component, adapt } = useMemo(() => typeInfo[type].adapter, [type])

  // pass the processed data to the rendering adapter and memoize the results
  const adaptedDataAndConfig = useMemo(() => adapt(transformedData ?? [], { ...config, wl, mapInitViewState, onAfterPlot: onWidgetRender })
    , [adapt, config, transformedData, wl, mapInitViewState, onWidgetRender])

  // render the component
  return (
    <div ref={ref} className={classes.container} >
      {addUserControls && userControlKeyValues?.length > 0 && (type === types.BAR ||
        (type === types.MAP && renderableValueKeys?.length === 1)) &&
        <UserValueControls/>
      }
      <div className={classes.widget}>
        {addTopCategories && !addUserControls &&
          <TopCategories/>
        }
        {Boolean(addUserControls && categoryKeyValues?.length && selectedUserDataControlIndex >= 0) && (
          <div className={classes.userValueDropdownSelect}>
            {userValueDropdownSelect}
          </div>
        )}
        {createElement(component,
          // 64 is the height of the WidgetValueControls container
          { width, height: renderUserControlValues ? height - 64 : height, ...adaptedDataAndConfig }
        )}
      </div>
    </div>
  )
}

export default WidgetAdapter
