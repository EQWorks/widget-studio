import React from 'react'
import PropTypes from 'prop-types'

import EditorRightSidebar from './right-sidebar'


const EditorModeControls = ({ children }) => (
  <>
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
