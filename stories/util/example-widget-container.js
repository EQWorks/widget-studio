import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../../src/studio/styles'

const useStyles = makeStyles(styles)

const propTypes = { children: PropTypes.element }

const ExampleWidgetContainer = ({ children }) => {
  const classes = useStyles()
  return (
    < div className={classes.content} >
      {children}
    </div >
  )
}

ExampleWidgetContainer.propTypes = propTypes

export default ExampleWidgetContainer
