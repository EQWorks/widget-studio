import React, { useEffect, useState } from 'react'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../store'


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
  const renderableValueKeys = useStoreState((state) => state. renderableValueKeys)

  const [selectedIndex, setSelectedIndex] = useState()

  // set selected benchmark key index
  useEffect(() => {
    if (selectedIndex === undefined && renderableValueKeys.length > 1) {
      setSelectedIndex(userControlKeyValues.indexOf(renderableValueKeys[1].key))
    }
  }, [selectedIndex, renderableValueKeys, userControlKeyValues])

  return (
    <div className={classes.benchmarkContainer}>
      {userControlHeadline &&
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
          }}
        >
          {formattedColumnNames[dataKey]}
        </button>
      ))}
    </div>
  )
}

export default UserValueControls
