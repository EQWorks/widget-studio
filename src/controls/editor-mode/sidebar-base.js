import React from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'
import { useStoreState } from '../../store'


const useStyles = (disabled) => makeStyles({
  outerContainer: {
    transition: 'filter 0.3s',
    ...(disabled && {
      filter: 'blur(1rem)',
      pointerEvents: 'none',
    }),
    borderLeft: `1px solid ${getTailwindConfigColor('secondary-300')}`,
    borderRight: `1px solid ${getTailwindConfigColor('secondary-300')}`,
    position: 'relative',
    width: '17.857rem !important',
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
