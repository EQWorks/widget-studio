import React, { createElement, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useResizeDetector } from 'react-resize-detector'
import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../store'
import typeInfo from '../../constants/type-info'
import types from '../../constants/types'
import UserValueControls from '../../user-controls/user-value-controls'
import TopCategories from '../../user-controls/top-categories'


const useStyles = ({ type, renderUserControlValues, addTopCategories }) => makeStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  widget: {
    ...(addTopCategories && { display: 'flex' }),
    // 64px is the height of the WidgetValueControls container
    height: renderUserControlValues ? 'calc(100% - 64px)' : '100%',
    padding: renderUserControlValues && type !== types.MAP ? '1rem' : 0,
  },
  userValueDropdownSelect: {
    position: 'absolute',
    margin: '1rem',
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
  const config = useStoreState((state) => state.config)
  const transformedData = useStoreState((state) => state.transformedData)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const addTopCategories = useStoreState((state) => state.addTopCategories)
  const userControlKeyValues = useStoreState((state) => state.userControlKeyValues)
  const selectedUserDataControlIndex = useStoreState((state) => state.selectedUserDataControlIndex)
  const categoryKeyValues = useStoreState((state) => state.categoryKeyValues)
  const userValueDropdownSelect = useStoreState((state) => state.userValueDropdownSelect)

  const dataKeyTitles = useMemo(() => Object.keys(transformedData?.[0]), [transformedData])
  const valueTitles = useMemo(() => renderableValueKeys.map(({ title }) => title), [renderableValueKeys])
  const transfDataIsReady = useMemo(() => valueTitles.every(title => dataKeyTitles.includes(title)), [valueTitles, dataKeyTitles])

  const { ref, width, height } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
  })

  useEffect(() => {
    ref?.current && update({ ui: { screenshotRef: ref.current } })
  }, [ref, update])

  const renderUserControlValues = useMemo(() => Boolean(addUserControls &&
    (userControlKeyValues.length > 0))
  , [addUserControls, userControlKeyValues])

  const classes = useStyles({ type, renderUserControlValues, addTopCategories })

  // memoize the correct adapter
  const { component, adapt } = useMemo(() => typeInfo[type].adapter, [type])

  // pass the processed data to the rendering adapter and memoize the results
  const adaptedDataAndConfig = useMemo(() => transformedData.length && transfDataIsReady ?
    adapt(transformedData, config) :
    null
  , [adapt, config, transformedData, transfDataIsReady])

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
        {adaptedDataAndConfig && createElement(component,
          // 64 is the height of the WidgetValueControls container
          { width, height: renderUserControlValues ? height - 64 : height, ...adaptedDataAndConfig }
        )}
      </div>
    </div>
  )
}

export default WidgetAdapter
