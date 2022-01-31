import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'
import { useStoreState } from '../../store'


const useStyles = (disabled) => makeStyles({
  outerContainer: {
    transition: 'filter 0.3s',
    ...(disabled && {
      filter: 'blur(1rem)',
      pointerEvents: 'none',
    }),
    position: 'relative',
    flex: '0 0 16rem',
    display: 'flex',
    flexDirection: 'column',
  },
})

const EditorSidebarBase = ({ children }) => {
  const dataReady = useStoreState((state) => state.dataReady)
  const classes = useStyles(!dataReady)
  return (
    <div className={classes.outerContainer}>
      {children}
    </div>
  )
}
EditorSidebarBase.propTypes = {
  children: PropTypes.node,
}
EditorSidebarBase.propTypes = {
  children: <></>,
}

export default EditorSidebarBase
