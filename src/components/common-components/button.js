import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import MUIButton from '@material-ui/core/Button'


const StyledButton = withStyles({
  root: {
    color: '#616161',
    boxShadow: 'none',
    fontSize: '14px',
    padding: '6px 12px',
    lineHeight: '20px',
    borderRadius: '4px',
    backgroundColor: '#EBEBEB',
    borderColor: '#EBEBEB',
    fontFamily: [
      '"Open Sans"',
      'sans-serif',
    ].join(','),
  },
})(MUIButton)

const useStyles = makeStyles({
  sm: { height: '36px' },
  default: { backgroundColor: '#EBEBEB' },
  warning: { color: '#FFFFFF', backgroundColor: '#F4B000', '&:hover': { backgroundColor: '#F7D272' } },
  success: { color: '#FFFFFF', backgroundColor: '#27AE60', '&:hover': { backgroundColor: '#79C99B' } },
})

const Button = ({ size, color, ...props }) => {
  const classes = useStyles()
  return (<StyledButton disableRipple className={`${classes[size]} ${classes[color]}`} {...props} />)
}

Button.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
}
Button.defaultProps = {
  size: 'sm',
  color: 'default',
}
export default Button
