import React, { Children } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  child: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    transition: 'opacity 300ms ease-in-out, visibility 0ms linear 300ms',
  },
  activeChild: {
    opacity: 1,
    visibility: 'visible',
  },
  hiddenChild: {
    opacity: 0,
    visibility: 'hidden',
    overflow: 'hidden',
  },
})

const FadeBetween = ({ value, children }) => (
  <div className={classes.container} >
    {
      Children.map(children, (child, i) => {
        if (i < 2) {
          const active = (!!i && value) || (!i && !value)
          return (
            <div className={`${classes.child} ${active ? classes.hiddenChild : classes.activeChild} `} >
              {child}
            </div>
          )
        }
      }
      )
    }
  </div >
)

FadeBetween.propTypes = {
  value: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default FadeBetween
