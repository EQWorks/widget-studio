import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'


const SIZE = 3
const BASE_SIZE = '51px'
const BORDER_WIDTH = 2

const classes = makeStyles({
  topRight: {
    borderTopRightRadius: '0.286rem',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  topLeft: {
    borderTopLeftRadius: '0.286rem',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  bottomRight: {
    borderBottomRightRadius: '0.286rem',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  bottomLeft: {
    borderBottomLeftRadius: '0.286rem',
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  top: {
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  bottom: {
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  left: {
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  right: {
    borderColor: getTailwindConfigColor('secondary-400'),
  },
  container: {
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: `1fr 1fr calc(${100 / SIZE}% + ${Math.floor(SIZE / 2)}px)`,
    gridTemplateRows: `1fr 1fr calc(${100 / SIZE}% + ${Math.ceil(SIZE / 2)}px)`,
    width: `calc(${BASE_SIZE} + ${BORDER_WIDTH}px)`,
    height: `calc(${BASE_SIZE} + ${BORDER_WIDTH}px)`,
    cursor: 'pointer',
    marginBottom: '3px',
    '&> *': {
      boxSizing: 'content-box',
      borderTop: `${BORDER_WIDTH}px solid ${getTailwindConfigColor('secondary-400')}`,
      borderLeft: `${BORDER_WIDTH}px solid ${getTailwindConfigColor('secondary-400')}`,
    },
    [`:nth-child(${SIZE}n)`]: {
      borderRight: `${BORDER_WIDTH}px solid ${getTailwindConfigColor('secondary-400')}`,
    },
    [`:nth-child(n+${((SIZE - 1) * (SIZE)) + 1})`]: {
      borderBottom: `${BORDER_WIDTH}px solid ${getTailwindConfigColor('secondary-400')}`,
    },
  },
  cell: {
    outline: 'none',
    '&:focus, &:hover': {
      outline: 'none',
    },
    boxSizing: 'border-box',
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
    cursor: 'default',
    borderColor: getTailwindConfigColor('secondary-400'),
    background: `${getTailwindConfigColor('secondary-300')} !important`,
  },
})


const GRID = [...Array(SIZE * SIZE).keys()].reverse().map(i => [(SIZE - 1 - (i % 3)) / (SIZE - 1), (Math.floor(i / 3)) / (SIZE - 1)])


const XYSelect = ({ value: [selectedX, selectedY], update, disabled }) => (
  <div className={classes.container}>
    {
      GRID.map((xy, i) => {
        const isDisabled = disabled.map(JSON.stringify).includes(JSON.stringify(xy))
        let styles = [classes.cell]
        if (isDisabled) {
          styles.unshift(classes.disabledCell)
        } else {
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
          }
        }
        return <button
          key={i}
          className={styles.join(' ')}
          onClick={() => !isDisabled && update(xy)}
        />
      })
    }
  </div>
)

XYSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  update: PropTypes.func.isRequired,
  disabled: PropTypes.arrayOf(PropTypes.array),
}
XYSelect.defaultProps = {
  disabled: [[0.5, 0.5]],
}

export default XYSelect
