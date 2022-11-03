import React, { useEffect, useMemo, useCallback } from 'react'

import { Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import CustomSelect from '../components/custom-select'
import { useStoreState, useStoreActions } from '../store'
import { cleanUp, capitalizeWords } from '../util/string-manipulation'
import modes from '../constants/modes'
import types from '../constants/types'
import { DATA_CATEGORIES, DATA_CATEGORIES_KEYS } from '../constants/insights-data-categories'


const useStyles = ({ marginTop }) => makeStyles({
  userControlContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    height: '4rem',
    background: getTailwindConfigColor('secondary-50'),
    boxShadow: '0px 0.125rem 0.5rem rgba(54, 111, 228, 0.1)',
    overflowX: 'auto',
    marginTop: `${marginTop}rem`,
  },
  userControlItem: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '1.123rem',
    lineHeight: '1.875rem',
    whiteSpace: 'pre-wrap',
    color: getTailwindConfigColor('secondary-900'),
    outline: 'none',
    '&:focus': {
      outline: 'none',
      color: getTailwindConfigColor('primary-500'),
      borderBottom: `0.125rem solid ${getTailwindConfigColor('primary-500')}`,
    },
  },
  selectedKey: {
    color: `${getTailwindConfigColor('primary-500')} !important`,
    borderBottom: `0.125rem solid ${getTailwindConfigColor('primary-500')}`,
  },
  selectRoot: {
    width: '15.625rem',
    border: `0.0625rem solid ${getTailwindConfigColor('interactive-500')}`,
    borderRadius: '0.25rem',
    boxShadow: '0px 0px 0px 2px rgba(49, 116, 213, 0.25)',
  },
  selectButton: {
    border: '0rem',
    backgroundColor: getTailwindConfigColor('secondary-50'),
  },
  selectMenu: {
    width: '15.625rem',
    backgroundColor: getTailwindConfigColor('secondary-50'),
  },
  selectedOptionTitle: {
    color: getTailwindConfigColor('secondary-700'),
    textTransform: 'none',
  },
})

const UserValueControls = () => {
  const update = useStoreActions(actions => actions.userUpdate)

  const formattedColumnNames = useStoreState((state) => state.formattedColumnNames)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const renderableValueKeys = useStoreState((state) => state. renderableValueKeys)
  const type = useStoreState((state) => state.type)
  const userControlHeadline = useStoreState((state) => state.userControlHeadline)
  const finalUserControlKeyValues = useStoreState((state) => state.finalUserControlKeyValues)
  const categoryFilter = useStoreState(state => state.categoryFilter)
  const selectedUserDataControlIndex = useStoreState((state) => state.selectedUserDataControlIndex)
  const dataCategoryKey = useStoreState((state) => state.dataCategoryKey)
  const categoryKeyValues = useStoreState((state) => state.categoryKeyValues)
  const selectedCategoryValue = useStoreState((state) => state.selectedCategoryValue)
  const mode = useStoreState(state => state.ui.mode)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const userControlKeyValues = useStoreState((state) => state.userControlKeyValues)

  const haveUserControls = useMemo(() => Boolean(addUserControls && userControlKeyValues.length),
    [addUserControls, userControlKeyValues])

  const MODE_DIMENSIONS = Object.freeze({
    [modes.EDITOR]: { marginTop: 0 },
    [modes.QL]: { marginTop: haveUserControls ? 0.75 : 0 },
    [modes.VIEW]: { marginTop: haveUserControls ? 0.75 : 0 },
    [modes.COMPACT]: { marginTop: 0 },
  })

  const classes = useStyles({ marginTop: MODE_DIMENSIONS[mode].marginTop || 0 })

  useEffect(() => {
    if (renderableValueKeys.length) {
      if (categoryFilter && (!dataCategoryKey || !finalUserControlKeyValues.includes(dataCategoryKey))) {
        update({ dataCategoryKey:  finalUserControlKeyValues[0] })
      } else if (!dataCategoryKey && !finalUserControlKeyValues.includes(renderableValueKeys[0].key)) {
        update({ dataCategoryKey: DATA_CATEGORIES_KEYS.find(key =>
          DATA_CATEGORIES[key].includes(renderableValueKeys[0].key)) })
      }
    }
  }, [update, renderableValueKeys, dataCategoryKey, finalUserControlKeyValues, categoryKeyValues, categoryFilter])

  useEffect(() => {
    if (categoryFilter) {
      update({ userValueFilter: [{ key: categoryFilter, filter: [dataCategoryKey] }] })
    }
  }, [categoryFilter, dataCategoryKey, update])

  // handles case when we select a new data category & we need to update visualization to the first key in categoryKeyValues
  useEffect(() => {
    const { key } = selectedCategoryValue
    if (type === types.MAP && dataCategoryKey && categoryKeyValues?.length && key &&
      !renderableValueKeys.map(({ key }) => key).includes(key)) {
      const { agg, mapVis } = renderableValueKeys[0]
      const val = {
        key,
        title: `${formattedColumnNames[key]}${agg ? ` (${agg})` : ''}`,
        ...(agg && { agg }),
        mapVis,
      }
      const index = mapValueKeys.findIndex(v => v.mapVis === mapVis)
      update({
        mapValueKeys: mapValueKeys.map((v, _i) => index === _i ? val : v),
      })
    }
  }, [
    selectedCategoryValue,
    type,
    dataCategoryKey,
    categoryKeyValues,
    renderableValueKeys,
    mapValueKeys,
    formattedColumnNames,
    update,
  ])

  const onClickHandle = useCallback((key) => {
    if (type === types.BAR) {
      if (valueKeys.length > 1) {
        valueKeys.pop()
      }
      const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
      // test if we use any type of aggregations for the valueKeys data
      const useAgg = JSON.stringify(valueKeys[0]).includes('agg')
      valueKeysCopy.push(
        {
          key,
          title: formattedColumnNames[key],
          // only add 'agg' key if we have aggregation operation attached to the value key in the valueKeys array
          ...(useAgg && { ['agg']: 'sum' }),
        }
      )
      update({ valueKeys: valueKeysCopy })
    }

    if (type === types.MAP) {
      const { agg, mapVis } = renderableValueKeys[0]
      if (categoryFilter) {
        update({
          userValueFilter: [{ key: categoryFilter, filter: [dataCategoryKey] }],
          dataCategoryKey: key,
        })
      } else if (DATA_CATEGORIES_KEYS.includes(key)) {
        update({ dataCategoryKey: key })
      } else {
        const val = {
          key,
          title: `${formattedColumnNames[key]}${agg ? ` (${agg})` : ''}`,
          ...(agg && { agg }),
          mapVis,
        }
        const index = mapValueKeys.findIndex(v => v.mapVis === mapVis)
        update({
          dataCategoryKey: null,
          mapValueKeys: mapValueKeys.map((v, _i) => index === _i ? val : v),
          selectedCategoryValue: null,
        })
      }
    }
  },
  [
    type,
    categoryFilter,
    dataCategoryKey,
    valueKeys,
    mapValueKeys,
    renderableValueKeys,
    formattedColumnNames,
    update,
  ])

  useEffect(() => {
    if (categoryKeyValues?.length) {
      update({ userValueDropdownSelect: (
        <CustomSelect
          id='user-value-custom-select'
          userSelect
          allowClear={false}
          classes={{
            root: classes.selectRoot,
            button: classes.selectButton,
            menu: classes.selectMenu,
            selectedOptionTitle: classes.selectedOptionTitle,
          }}
          overflow='vertical'
          endIcon={<Icons.ArrowDown size='md' />}
          data={categoryKeyValues}
          value={selectedCategoryValue?.title}
          onSelect={v => {
            if (v) {
              const { agg, mapVis } = renderableValueKeys[0]
              const title = `${formattedColumnNames[v]}${agg ? ` (${agg})` : ''}`
              const val = {
                key: v,
                title,
                ...(agg && { agg }),
                mapVis,
              }
              const index = mapValueKeys.findIndex(v => v.mapVis === mapVis)
              update({
                selectedCategValue: v,
                mapValueKeys: mapValueKeys.map((v, _i) => index === _i ? val : v),
              })
            }
          }}
          placeholder='Select data column'
        />
      ) })
    }
  }, [
    categoryKeyValues,
    selectedCategoryValue,
    renderableValueKeys,
    formattedColumnNames,
    mapValueKeys,
    update,
    classes,
  ])

  return (
    <div id='user-control-container' className={classes.userControlContainer}>
      {type === types.BAR && userControlHeadline &&
        <div className={classes.userControlItem}>
          {capitalizeWords(userControlHeadline)}:
        </div>
      }
      {finalUserControlKeyValues?.map((key, i) => (
        <button
          key={i}
          className={
            `${classes.userControlItem} ${selectedUserDataControlIndex === i ? classes.selectedKey : ''}`
          }
          onClick={() => {
            update({ selectedUserDataControlIndex: i })
            onClickHandle(key)
          }}
        >
          {formattedColumnNames[key] || cleanUp(key)}
        </button>
      ))}
    </div>
  )
}

export default UserValueControls
