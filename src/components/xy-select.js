import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'


const SIZE = 3

const classes = makeStyles({
  topRight: {
    borderTopRightRadius: '0.3rem',
    borderTopWidth: '2px',
    borderRightWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  topLeft: {
    borderTopLeftRadius: '0.3rem',
    borderTopWidth: '2px',
    borderLeftWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  bottomRight: {
    borderBottomRightRadius: '0.3rem',
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  bottomLeft: {
    borderBottomLeftRadius: '0.3rem',
    borderBottomWidth: '2px',
    borderLeftWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  top: {
    borderTopWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  bottom: {
    borderBottomWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  left: {
    borderLeftWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  right: {
    borderRightWidth: '2px',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  container: {
    display: 'grid',
    gridTemplateColumns: `calc(${100 / SIZE}% + 1px) ${100 / SIZE}% calc(${100 / SIZE}% + 1px)`,
    gridTemplateRows: `calc(${100 / SIZE}% + 1px) ${100 / SIZE}% calc(${100 / SIZE}% + 1px)`,
    width: '3.7rem',
    height: '3.7rem',
    cursor: 'pointer',
  },
  oddCell: {
    background: getTailwindConfigColor('secondary-300'),
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
  },
  activeCell: {
    '&:hover': {
      background: getTailwindConfigColor('primary-100'),
    },
  },
  selectedCell: {
    background: getTailwindConfigColor('primary-400'),
    '&:hover': {
      background: `${getTailwindConfigColor('primary-400')} !important`,
    },
  },
  disabledCell: {
    outline: 'none',
    cursor: 'auto',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
})


const GRID = [...Array(SIZE * SIZE).keys()].reverse().map(i => {
  const x = (SIZE - 1 - (i % 3)) / (SIZE - 1)
  const y = (Math.floor(i / 3)) / (SIZE - 1)
  return x === 0.5 && y === 0.5
    ? null
    : [x, y]
})


const XYSelect = ({ value: [selectedX, selectedY], update }) => (
  <div className={classes.container}>
    {
      GRID.map((xy, i) => {
        let styles = [classes.cell]
        if (xy) {
          const [x, y] = xy
          if (x === selectedX && y === selectedY) {
            styles.unshift(classes.selectedCell)
          }
          if (x % 1 || y % 1) {
            if (y === 1) {
              styles.unshift(classes.top)
            } else if (!y) {
              styles.unshift(classes.bottom)
            }
            if (x === 1) {
              styles.unshift(classes.right)
            } else if (!x) {
              styles.unshift(classes.left)
            }
          } else if (x) {
            styles.unshift(y ? classes.topRight : classes.bottomRight)
          } else {
            styles.unshift(y ? classes.topLeft : classes.bottomLeft)
          }
          styles.unshift(classes.activeCell)
        } else {
          styles.unshift(classes.disabledCell)
        }
        if (!(i % 2)) {
          styles.unshift(classes.oddCell)
        }
        return <button
          key={i}
          className={styles.join(' ')}
          onClick={() => xy && update(xy)}
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
