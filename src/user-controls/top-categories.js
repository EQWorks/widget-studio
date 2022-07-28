import React, { useState, useMemo } from 'react'

import { List, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState } from '../store'
import { cleanUp } from '../util/string-manipulation'
import { numberToOrdinal } from '../util/numeric'


const classes = makeStyles({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: '1.75rem',
    height: '3.1875',
    width: '15rem',
    padding: '0.625rem  1rem',
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
  },
})

const TopCategories = () => {
  const rows = useStoreState((state) => state.rows)
  const [selectedCategory, setSelectedCategory] = useState(0)

  const rankedCategories = useMemo(() => rows.reduce((acc, { category, ranking }) => {
    if (!JSON.stringify(acc).includes(category)) {
      acc = [...acc, { category, ranking }]
    }
    return acc
  }, [] ).sort((a, b) => a.ranking - b.ranking), [rows])

  return (
    <>
      <List
        gridCols={2}
        data={rankedCategories}
        renderItem={( { item, index, ListCol }) => (
          <List.ListItem key={index}>
            <ListCol colSpan={1}>
              <button
                className={index === selectedCategory ?
                  `${classes.button} ${classes.selectedCategory}` :
                  `${classes.button}`}
                onClick={() => setSelectedCategory(index)}
              >
                <div className={classes.ranking}>
                  {numberToOrdinal(item.ranking)}
                </div>
                <div className={classes.category}>
                  {cleanUp(item.category)}
                </div>
              </button>
            </ListCol>
          </List.ListItem>
        )}
      />
    </>
  )
}

TopCategories.propTypes = {}

TopCategories.defaultProps = {}

export default TopCategories
