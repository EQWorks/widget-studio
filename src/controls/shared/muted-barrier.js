import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'


const useStyles = ({ mute }) => makeStyles({
  container: {
    transition: 'opacity 0.3s',
    ...(mute
      ? {
        opacity: 0.2,
        pointerEvents: 'none',
        userSelect: 'none',
      }
      : {
        opacity: 1,
      }),
  },
  message: {
    zIndex: 99,
    position: 'absolute',
    background: getTailwindConfigColor('secondary-200'),
    color: getTailwindConfigColor('secondary-600'),
    borderRadius: '0.7rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    margin: '1rem',
    padding: '2rem 1rem',
    lineHeight: '1.4rem',
  },
})


const MutedBarrier = ({ mute, message, children }) => {
  const classes = useStyles({ mute })
  return (
    <>
      {
        mute && message &&
        <div className={classes.message}>
          {message}
        </div>
      }
      <div className={classes.container}>
        {children}
      </div>
    </>
  )
}
MutedBarrier.propTypes = {
  mute: PropTypes.bool,
  message: PropTypes.string,
  children: PropTypes.node,
}
MutedBarrier.defaultProps = {
  mute: false,
  message: '',
  children: <></>,
}

export default MutedBarrier
