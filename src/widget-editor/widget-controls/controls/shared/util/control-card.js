import React from 'react'
import { Typography } from '@eqworks/lumen-ui'
import { makeStyles } from '@material-ui/core/styles'

import styles from '../../../styles'

const useStyles = makeStyles(styles)

const WidgetControlCard = ({ title, children }) => {

  const classes = useStyles()
  return (
    <>
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
      <div className={classes.controlCard}>
        {children}
      </div >
    </ >
  )
}

export default WidgetControlCard
