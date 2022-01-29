import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'


const SIZE = 3

const classes = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${SIZE}, 1fr)`,
    width: '2rem',
    height: '2rem',
    cursor: 'pointer',
    border: 'solid 1px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  cell: {
    outline: 'none',
    '&:focus, &:hover': {
      outline: 'none',
    },
    border: 'solid',
    borderWidth: '1px',
    borderColor: getTailwindConfigColor('secondary-400'),
    transition: 'all 0.3s',
    '&:hover': {
      background: getTailwindConfigColor('secondary-300'),
    },
  },
  selectedCell: {
    background: getTailwindConfigColor('primary-400'),
    '&:hover': {
      background: getTailwindConfigColor('primary-400'),
    },
  },
  disabledCell: {
    outline: 'none',
    cursor: 'auto',
    border: 'solid',
    borderColor: getTailwindConfigColor('secondary-400'),
    borderWidth: '1px',
    '&:hover': {
      background: 'transparent',
    },
  },
})


const grid = [...Array(SIZE * SIZE).keys()].reverse().map(i => {
  const x = (SIZE - 1 - (i % 3)) / (SIZE - 1)
  const y = (Math.floor(i / 3)) / (SIZE - 1)
  return x === 0.5 && y === 0.5
    ? null
    : [x, y]
}
)


const XYSelect = ({ value: [selectedX, selectedY], update }) => (
  <div className={classes.container}>
    {
      grid.map((xy, i) => {
        let styles = [classes.cell]
        const disabled = !xy
        if (disabled) {
          styles.unshift(classes.disabledCell)
        } else if (xy[0] === selectedX && xy[1] === selectedY) {
          styles.unshift(classes.selectedCell)
        }
        return <button
          key={i}
          className={styles.join(' ')}
          onClick={() => !disabled && update(xy)}
        />
      })
    }
  </div>
)

XYSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  update: PropTypes.func,
}

export default XYSelect
