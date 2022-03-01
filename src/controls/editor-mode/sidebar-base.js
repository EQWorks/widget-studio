import React from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'
import { useStoreState } from '../../store'


const useStyles = ({ isLeft, dataSourceLoading }) => makeStyles({
  outerContainer: {
    ...(dataSourceLoading && {
      opacity: '0.3 !important',
      pointerEvents: 'none !important',
    }),
    transition: 'opacity 1s',
    ...(isLeft
      ? { borderRight: `1px solid ${getTailwindConfigColor('secondary-300')}` }
      : { borderLeft: `1px solid ${getTailwindConfigColor('secondary-300')}` }
    ),
    position: 'relative',
    width: '17.857rem !important',
    display: 'flex',
    flexDirection: 'column',
    ':last-child': {
      borderBottom: 'none !important',
    },
  },
})

const EditorSidebarBase = ({ children, isLeft }) => {
  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)
  const classes = useStyles({ isLeft, dataSourceLoading })
  return (
    <div className={classes.outerContainer}>
      {children}
    </div>
  )
}
EditorSidebarBase.propTypes = {
  children: PropTypes.node.isRequired,
  isLeft: PropTypes.bool,
}
EditorSidebarBase.defaultProps = {
  isLeft: false,
}

export default EditorSidebarBase
