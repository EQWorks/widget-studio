import React from 'react'
import PropTypes from 'prop-types'

import EditorRightSidebar from './right-sidebar'
import EditorLeftSidebar from './left-sidebar'


const EditorModeControls = ({ children }) => (
  <>
    <EditorLeftSidebar />
    {children}
    <EditorRightSidebar />
  </>
)
EditorModeControls.propTypes = {
  children: PropTypes.node,
}
EditorModeControls.defaultProps = {
  children: <></>,
}

export default EditorModeControls
