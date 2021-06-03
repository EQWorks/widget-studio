import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import MUICard from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import ClearIcon from '@material-ui/icons/Clear'


const useStyles = makeStyles({
  root: {
    border: '1px solid #0075FF',
    borderRadius: '4px',
    boxShadow: '0px 4px 30px rgba(12, 12, 13, 0.05)',
  },
  sm: { width: '450px' },
  header: { paddingBottom: 0 },
  clearIcon: {
    width: '20px',
    height: '20px',
    color: '#0075FF',
    '&:hover': { cursor: 'pointer' },
  },
  content: { paddingTop: 0 },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: '24px',
    letterSpacing: '0.15px',
    paddingBottom: 5,
  },
  actions: {
    display: 'flex',
    padding: '8px',
    justifyContent: 'flex-end',
  },
})

const Card = ({ size, title, content, actions, onClose }) => {
  const classes = useStyles()

  return (
    <MUICard className={`${classes.root} ${classes[size]}`}>
      <CardHeader className={classes.header} action={onClose && <ClearIcon className={classes.clearIcon} onClick={onClose} />}/>
      <CardContent className={classes.content}>
        {title && <Typography className={classes.title} variant='h6'>{title}</Typography>}
        {content}
      </CardContent>
      {actions && <CardActions className={classes.actions}>{actions}</CardActions>}
    </MUICard>
  )
}

Card.propTypes = {
  size: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.any,
  actions: PropTypes.any,
  onClose: PropTypes.func,
}
Card.defaultProps = {
  size: 'sm',
  title: '',
  content: '',
  actions: '',
  onClose: null,
}
export default Card
