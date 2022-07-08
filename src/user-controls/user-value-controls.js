import React, { useEffect, useState, useCallback } from 'react'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../store'
import types from '../constants/types'


const classes = makeStyles({
  benchmarkContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3rem',
    height: '4rem',
    background: getTailwindConfigColor('secondary-50'),
    // boxShadow: `0 0 0.2rem ${getTailwindConfigColor('shadow-blue-20')}`,
    // HOW to add opacity with hex color from getTailwindConfigColor???
    boxShadow: '0px 0.125rem 0.5rem rgba(54, 111, 228, 0.1)',
  },
  benchmarkItems: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '1.123rem',
    lineHeight: '1.875rem',
    // letterSpacing: '0.015625rem',
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
})

const UserValueControls = () => {
  const update = useStoreActions(actions => actions.userUpdate)
  const userControlHeadline = useStoreState((state) => state.userControlHeadline)
  const userControlKeyValues = useStoreState((state) => state.userControlKeyValues)
  const formattedColumnNames = useStoreState((state) => state.formattedColumnNames)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const renderableValueKeys = useStoreState((state) => state. renderableValueKeys)
  const type = useStoreState((state) => state.type)

  const [selectedIndex, setSelectedIndex] = useState()

  // set selected benchmark key index
  useEffect(() => {
    if ([undefined, -1].includes(selectedIndex)) {
      if (type === types.BAR && renderableValueKeys.length > 1 && userControlKeyValues.includes(renderableValueKeys[1].key)) {
        setSelectedIndex(userControlKeyValues.indexOf(renderableValueKeys[1].key))
      }
      if (type === types.MAP && renderableValueKeys.length > 0 && userControlKeyValues.includes(renderableValueKeys[0].key)) {
        setSelectedIndex(userControlKeyValues.indexOf(renderableValueKeys[0].key))
      }
    }
  }, [type, selectedIndex, renderableValueKeys, userControlKeyValues])

  const onClickHandle = useCallback((dataKey) => {
    if (type === types.BAR) {
      if (valueKeys.length > 1) {
        valueKeys.pop()
      }
      const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
      // test if we use any type of aggregations for the valueKeys data
      const useAgg = JSON.stringify(valueKeys[0]).includes('agg')
      valueKeysCopy.push(
        {
          key: dataKey,
          title: formattedColumnNames[dataKey],
          // only add 'agg' key if we have aggregation operation attached to the value key in the valueKeys array
          ...(useAgg && { ['agg']: 'unique' }),
        }
      )
      update({ valueKeys: valueKeysCopy })
    }
    if (type === types.MAP) {
      const { agg, mapVis } = renderableValueKeys[0]
      const title = `${formattedColumnNames[dataKey]}${agg ? ` (${agg})` : ''}`
      const val = {
        key: dataKey,
        title,
        ...(agg && { agg }),
        mapVis,
      }
      const index = mapValueKeys.findIndex(v => v.mapVis === mapVis)
      update({ mapValueKeys: mapValueKeys.map((v, _i) => index === _i ? val : v) })
    }
  }, [type, valueKeys, mapValueKeys, renderableValueKeys, formattedColumnNames, update])

  return (
    <div className={classes.benchmarkContainer}>
      {type === types.BAR && userControlHeadline &&
        <div className={classes.benchmarkItems}>
          {userControlHeadline}:
        </div>
      }
      {userControlKeyValues.map((dataKey, i) => (
        <button
          key={i}
          className={selectedIndex === i ?
            `${classes.benchmarkItems} ${classes.selectedKey}` :
            `${classes.benchmarkItems}`
          }
          onClick={() => {
            setSelectedIndex(i)
            onClickHandle(dataKey)
          }}
        >
          {formattedColumnNames[dataKey]}
        </button>
      ))}
    </div>
  )
}

export default UserValueControls
