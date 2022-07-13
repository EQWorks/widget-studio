import React, { useEffect, useCallback } from 'react'

import { Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import CustomSelect from '../components/custom-select'
import { useStoreState, useStoreActions } from '../store'
import { cleanUp } from '../util/string-manipulation'
import types from '../constants/types'
import { DATA_CATEGORIES, DATA_CATEGORIES_KEYS } from '../constants/insights-data-categories'


const classes = makeStyles({
  benchmarkContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    height: '4rem',
    background: getTailwindConfigColor('secondary-50'),
    boxShadow: '0px 0.125rem 0.5rem rgba(54, 111, 228, 0.1)',
  },
  benchmarkItems: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '1.123rem',
    lineHeight: '1.875rem',
    textTransform: 'capitalize',
    color: getTailwindConfigColor('secondary-900'),
    outline: 'none',
    '&:focus': {
      outline: 'none',
      color: getTailwindConfigColor('primary-500'),
      borderBottom: `0.125rem solid ${getTailwindConfigColor('primary-500')}`,
    },
  },
  selectedKey: {
    color: getTailwindConfigColor('primary-500'),
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
  const selectedUserDataControlIndex = useStoreState((state) => state.selectedUserDataControlIndex)
  const dataCategoryKey = useStoreState((state) => state.dataCategoryKey)
  const categoryKeyValues = useStoreState((state) => state.categoryKeyValues)
  const selectedCategoryValue = useStoreState((state) => state.selectedCategoryValue)

  useEffect(() => {
    if (renderableValueKeys.length && !dataCategoryKey &&
      !finalUserControlKeyValues.includes(renderableValueKeys[0].key)) {
      update({ dataCategoryKey: DATA_CATEGORIES_KEYS.find(key =>
        DATA_CATEGORIES[key].includes(renderableValueKeys[0].key)) })
    }
  }, [update, renderableValueKeys, dataCategoryKey, finalUserControlKeyValues, categoryKeyValues])

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
          ...(useAgg && { ['agg']: 'unique' }),
        }
      )
      update({ valueKeys: valueKeysCopy })
    }
    if (type === types.MAP) {
      const { agg, mapVis } = renderableValueKeys[0]
      if (DATA_CATEGORIES_KEYS.includes(key)) {
        update({ dataCategoryKey: key })
      } else {
        const title = `${formattedColumnNames[key]}${agg ? ` (${agg})` : ''}`
        const val = {
          key,
          title,
          ...(agg && { agg }),
          mapVis,
        }
        const index = mapValueKeys.findIndex(v => v.mapVis === mapVis)
        update({ dataCategoryKey: null })
        update({ mapValueKeys: mapValueKeys.map((v, _i) => index === _i ? val : v) })
        update({ selectedCategoryValue: null })
      }
    }
  },
  [
    type,
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
          value={selectedCategoryValue}
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
              update({ selectedCategValue: v })
              update({ mapValueKeys: mapValueKeys.map((v, _i) => index === _i ? val : v) })
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
  ])

  return (
    <div className={classes.benchmarkContainer}>
      {type === types.BAR && userControlHeadline &&
        <div className={classes.benchmarkItems}>
          {userControlHeadline}:
        </div>
      }
      {finalUserControlKeyValues?.map((key, i) => (
        <button
          key={i}
          className={selectedUserDataControlIndex === i ?
            `${classes.benchmarkItems} ${classes.selectedKey}` :
            `${classes.benchmarkItems}`
          }
          onClick={() => {
            update({ selectedUserDataControlIndex: i })
            onClickHandle(key)
          }}
        >
          {formattedColumnNames[key] ? formattedColumnNames[key] : cleanUp(key)}
        </button>
      ))}
    </div>
  )
}

export default UserValueControls
