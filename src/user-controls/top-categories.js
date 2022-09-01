import React, { useState, useMemo, useEffect } from 'react'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../store'
import { cleanUp } from '../util/string-manipulation'
import { numberToOrdinal } from '../util/numeric'
import { TOP_COLUMN_KEYS } from '../constants/columns'


const classes = makeStyles({
  topCategories: {
    display: 'flex',
    flexDirection: 'column',
    margin: '.625rem 0rem',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: '1.75rem',
    padding: '0.8435rem 1rem',
    borderRight: `0.0625rem solid ${getTailwindConfigColor('secondary-200')}`,
    outline: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  selectedCategory: {
    backgroundColor: getTailwindConfigColor('neutral-50'),
    borderRight: `0.0625rem solid ${getTailwindConfigColor('primary-500')}`,
  },
  ranking: {
    width: '2.625rem',
    fontSize: '0.875rem',
    textAlign: 'left',
    color: getTailwindConfigColor('secondary-700'),
  },
  category: {
    fontSize: '1rem',
    fontWeight: 400,
    color: getTailwindConfigColor('secondary-900'),
    whiteSpace: 'nowrap',
    width: 'fit-content',
    textAlign: 'left',
  },
})

const TopCategories = () => {
  const update = useStoreActions(actions => actions.update)

  const rows = useStoreState(state => state.rows)
  const addTopCategories = useStoreState(state => state.addTopCategories)
  const propFilters = useStoreState(state => state.propFilters)
  const [selectedCategory, setSelectedCategory] = useState(0)

  const categoryKey = useMemo(() =>
    Object.keys(rows[0]).find(key => key.includes(TOP_COLUMN_KEYS.category)), [rows])
  const rankingKey = useMemo(() =>
    Object.keys(rows[0]).find(key => key.includes(TOP_COLUMN_KEYS.ranking)), [rows])

  const rankedCategories = useMemo(() => rows.reduce((acc, row) => {
    if (!JSON.stringify(acc).includes(row[categoryKey])) {
      const { [rankingKey]: ranking, [categoryKey]: category } = row
      acc = [...acc, { ranking, category }]
    }
    return acc
  }, [] ).sort((a, b) => a.ranking - b.ranking), [categoryKey, rankingKey, rows])

  useEffect(() => {
    if (addTopCategories && selectedCategory === 0 && !JSON.stringify(propFilters).includes(categoryKey)) {
      update({
        propFilters: [
          { key: categoryKey, filter: [rankedCategories[0].category] },
        ],
      })
    }
  }, [addTopCategories, selectedCategory, propFilters, rankedCategories, categoryKey, update])

  return (
    <div className={classes.topCategories}>
      {rankedCategories.map((item, index) => (
        <button
          key={index}
          className={index === selectedCategory ?
            `${classes.button} ${classes.selectedCategory}` :
            `${classes.button}`}
          onClick={() => {
            setSelectedCategory(index)
            update({
              propFilters: [
                { key: categoryKey, filter: [item.category] },
              ],
            })
          }}
        >
          <div className={classes.ranking}>
            {numberToOrdinal(item.ranking)}
          </div>
          <div id='category' className={classes.category}>
            {cleanUp(item.category)}
          </div>
        </button>
      ))}
    </div>
  )
}

TopCategories.propTypes = {}

TopCategories.defaultProps = {}

export default TopCategories
