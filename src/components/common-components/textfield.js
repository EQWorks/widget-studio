import React from 'react'
import PropTypes from 'prop-types'

import { fade, makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputBase from '@material-ui/core/InputBase'
import grey from '@material-ui/core/colors/grey'


const StyledTextField = withStyles((theme) => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    'label + &': {
      marginTop: theme.spacing(0.5),
    },
    borderRadius: 2,
    border: `1px solid ${grey[300]}`,
    fontSize: theme.typography.body1,
    padding: '4px 6px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  focused: {
    boxShadow: `${fade(theme.palette.primary[100], 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
  multiline: { minHeight: 80 },
  inputMultiline: { minHeight: 80 },
}))(InputBase)

const useStyles = makeStyles((theme) => ({
  root: ({ width='100%' }) => ({ width, marginTop: 5, marginBottom: 5 }),
  labelGroup: { display: 'flex', maxHeight: 30, marginBottom: 5 },
  label: {
    maxHeight: 16,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(0.5),
    color: 'rgba(0, 0, 0, 0.6)',
  },
  required: { margin: '8px 0px 0px 0px', color: 'red' },
}))

const Textfield = ({ width, label, required, ...props }) => {
  const classes = useStyles({ width })
  return (
    <FormControl className={classes.root}>
      {label && <div className={classes.labelGroup}>
        <Typography variant='caption' className={classes.label}>{label}</Typography>
        {required && <p className={classes.required}>*</p>}
      </div>}
      <StyledTextField color='primary' required={required} {...props} />
    </FormControl>
  )
}

Textfield.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  label: PropTypes.string,
  required: PropTypes.bool,
}
Textfield.defaultProps = {
  width: '100%',
  label: '',
  required: false,
}
export default Textfield
