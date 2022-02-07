import React from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  outerContainer: {
    transition: 'filter 0.3s',
    borderLeft: `1px solid ${getTailwindConfigColor('secondary-300')}`,
    borderRight: `1px solid ${getTailwindConfigColor('secondary-300')}`,
    position: 'relative',
    width: '17.857rem !important',
    display: 'flex',
    flexDirection: 'column',
  },
})

const EditorSidebarBase = ({ children }) => (
  <div className={classes.outerContainer}>
    {children}
  </div>
)
EditorSidebarBase.propTypes = {
  children: PropTypes.node,
}
EditorSidebarBase.propTypes = {
  children: <></>,
}

export default EditorSidebarBase
