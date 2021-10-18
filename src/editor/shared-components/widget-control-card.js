import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'

import styles from '../styles'


const useStyles = makeStyles(styles)

const WidgetControlCard = ({ title, titleExtra, children }) => {

  const classes = useStyles()
  return (
    children &&
    <div className={classes.controlCard}>
      <div className={classes.controlRow}>
        {
          title &&
          <Typography
            className={classes.controlCardHeader}
            color='textSecondary'
            variant='subtitle1'
          >
            {title}
          </Typography>
        }
        {titleExtra}
      </div>
      {children}
    </ div>
  )
}

WidgetControlCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.elementType, PropTypes.array]),
  title: PropTypes.string,
  titleExtra: PropTypes.elementType
}

WidgetControlCard.defaultProps = {
  children: [],
  title: '',
  titleExtra: null
}

export default WidgetControlCard
