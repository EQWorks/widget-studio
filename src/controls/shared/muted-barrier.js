import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'


const useStyles = ({ mute, message, variant }) => makeStyles({
  container: {
    transition: 'opacity 0.3s',
    ...(mute
      ? {
        '> *': {
          opacity: 0.2,
          pointerEvents: 'none',
          userSelect: 'none',
        },
        ...(message && {
          '#muted-barrier-message': {
            opacity: '1 !important',
          },
        }),
      }
      : {
        opacity: 1,
      }),
    position: 'relative',
  },
  ...(variant === 0 && {
    message: {
      width: 'calc(100% - 2rem)',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      zIndex: 2,
      position: 'absolute',
      background: getTailwindConfigColor('secondary-200'),
      color: getTailwindConfigColor('secondary-600'),
      borderRadius: '0.4rem',
      fontSize: '0.9rem',
      fontWeight: 500,
      margin: '1rem',
      padding: '2rem 1rem',
      lineHeight: '1.4rem',
    },
  }),
  ...(variant === 1 && {
    message: {
      whiteSpace: 'normal',
      width: 'calc(100% - 2rem)',
      wordWrap: 'break-word',
      zIndex: 2,
      position: 'absolute',
      background: 'white',
      color: getTailwindConfigColor('secondary-800'),
      borderRadius: '0.4rem',
      fontSize: '0.9rem',
      fontWeight: 500,
      margin: '1rem',
      padding: '2rem 1rem',
      lineHeight: '1.4rem',
    },
  }),
})


const MutedBarrier = ({ mute, message, children, variant }) => {
  const classes = useStyles({ mute, message, variant })
  return (
    <>
      <div className={classes.container}>
        {
          mute && message &&
          <div id='muted-barrier-message' className={classes.message}>
            {message}
          </div>
        }
        {children}
      </div>
    </>
  )
}
MutedBarrier.propTypes = {
  mute: PropTypes.bool,
  message: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.number,
}
MutedBarrier.defaultProps = {
  mute: false,
  message: '',
  children: <></>,
  variant: 0,
}

export default MutedBarrier
