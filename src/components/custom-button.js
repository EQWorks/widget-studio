import React from 'react'
import PropTypes from 'prop-types'

import { Button, makeStyles } from '@eqworks/lumen-labs'


const CUSTOM_SIZES = {
  'sm': 0.714,
  'md': 0.857,
  'lg': 1,
}

const useStyles = (textTransform, customSize) => {
  const size = CUSTOM_SIZES[customSize]
  return makeStyles({
    button: {
      textTransform,
      transition: 'all 0.3s',
      outline: 'none !important',
      '&:focus': {
        outline: 'none !important',
      },
      padding: `${size / 4}rem ${size / 2}rem`,
      fontSize: `${size}rem`,
      display: 'flex',
      '& svg': {
        margin: `0 ${size / 4}rem`,
      },
    },
    horizontalMargin: {
      margin: '0 0.2rem',
      width: 'inherit',
      height: 'inherit',
      '& button': {
        width: '100%',
        height: '100%',
      },
    },
    children: {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        margin: '0 0.2rem',
      },
    },
  })
}

const CustomButton = ({
  // custom props
  textTransform,
  customSize,
  horizontalMargin,
  // lumen-labs props
  variant,
  type,
  onClick,
  classes: { button: buttonClass = '', lumenClasses },
  children,
  ...props
}) => {
  const classes = useStyles(textTransform, customSize)

  const renderButton = (
    <Button
      classes={{
        ...lumenClasses,
        button: `${classes.button} ${buttonClass}`,
      }}
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}
      variant={variant}
      type={type}
      {...props}
    >
      <div className={classes.children}>
        {children}
      </div>
    </Button>
  )

  return horizontalMargin
    ? <div className={classes.horizontalMargin}>
      {renderButton}
    </div>
    : renderButton
}

CustomButton.propTypes = {
  textTransform: PropTypes.oneOf(['capitalize', 'uppercase']),
  customSize: PropTypes.oneOf(Object.keys(CUSTOM_SIZES)),
  horizontalMargin: PropTypes.bool,
  variant: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  classes: PropTypes.object,
  children: PropTypes.node,
}
CustomButton.defaultProps = {
  textTransform: 'uppercase',
  customSize: 'sm',
  horizontalMargin: false,
  variant: 'borderless',
  type: 'primary',
  onClick: () => { },
  classes: {},
  children: <></>,
}

export default CustomButton
