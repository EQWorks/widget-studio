import React from 'react'
import PropTypes from 'prop-types'

import { Button, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  horizontalMargin: {
    margin: '0 0.357rem',
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
  },
})

const CustomButton = ({
  // custom props
  horizontalMargin,
  // lumen-labs props
  onClick,
  children,
  ...props
}) => {
  const renderButton = (
    <Button
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}
      {...props}
    >
      {children}
    </Button>
  )

  return horizontalMargin
    ? <div className={classes.horizontalMargin}>
      {renderButton}
    </div>
    : renderButton
}

CustomButton.propTypes = {
  horizontalMargin: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
}
CustomButton.defaultProps = {
  horizontalMargin: false,
  variant: 'borderless',
  size: 'sm',
  onClick: () => { },
  children: <></>,
}

export default CustomButton
