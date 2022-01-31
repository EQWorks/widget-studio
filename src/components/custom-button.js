import React from 'react'
import PropTypes from 'prop-types'
import { Button, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  base: {
    fontFamily: 'Open Sans,sans-serif',
    transition: 'all 0.3s',
    outline: 'none !important',
    '&:focus': {
      outline: 'none !important',
    },
  },
  horizontalMargin: {
    margin: '0 0.3rem',
  },
  children: {
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      margin: '0 0.2rem',
    },
  },
  cutLeft: {
    borderTopLeftRadius: '0 !important',
    borderBottomLeftRadius: '0 !important',
  },
  cutRight: {
    borderTopRightRadius: '0 !important',
    borderBottomRightRadius: '0 !important',
  },
  variant1: {
    textTransform: 'uppercase',
  },
  variant2: {
    textTransform: 'uppercase',
    padding: '0.1rem 0.3rem',
    fontSize: '0.625rem',
    color: `${getTailwindConfigColor('primary-500')} !important`,
    fontWeight: 400,
    '& svg': {
      fill: `${getTailwindConfigColor('primary-500')} !important`,
    },
  },
  variant3: {
    textTransform: 'uppercase',
    padding: '0.1rem 0.3rem',
    fontSize: '0.625rem',
    background: `${getTailwindConfigColor('primary-500')} !important`,
    color: `${getTailwindConfigColor('secondary-50')} !important`,
    fontWeight: 400,
    '& svg': {
      fill: `${getTailwindConfigColor('secondary-50')} !important`,
    },
  },
  variant4: {

  },
})

const CustomButton = ({ className, onClick, children, customVariant, horizontalMargin, cutRight, cutLeft, ...props }) => {

  const _children = (
    <div className={classes.children}>
      {children}
    </div>
  )

  const cut = `${cutRight ? classes.cutRight : ''} ${cutLeft ? classes.cutLeft : ''}`

  const customVariants = [
    <>
      <Button
        className={`${className} ${classes.base}`}
        classes={{
          button: `${classes.base} ${cut}`,
        }}
        onClick={e => {
          e.stopPropagation()
          onClick(e)
        }}
        {...props}
      >
        {_children}
      </Button>
    </>,

    <>
      <Button
        classes={{
          button: `${classes.base} px-1.5 py-1.5 tracking-widest ${className} ${cut}`,
        }}
        type='primary'
        variant='borderless'
        size='md'
        onClick={e => {
          e.stopPropagation()
          onClick(e)
        }}
        {...props}
      >
        {_children}
      </Button >
    </>,

    <>
      <Button
        classes={{
          button: `${classes.base} ${classes.variant2} tracking-widest ${cut}`,
        }}
        type='primary'
        variant='outlined'
        size='md'
        onClick={e => {
          e.stopPropagation()
          onClick(e)
        }}
        {...props}
      >
        {_children}
      </Button >
    </>,

    <>
      <Button
        classes={{
          button: `${classes.base} ${classes.variant3} tracking-widest ${cut}`,
        }}
        type='primary'
        variant='outlined'
        size='md'
        onClick={e => {
          e.stopPropagation()
          onClick(e)
        }}
        {...props}
      >
        {_children}
      </Button >
    </>,
  ]

  const final = customVariants[customVariant] || customVariants[0]
  return horizontalMargin
    ? <div className={classes.horizontalMargin}>
      {final}
    </div>
    : final
}

CustomButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  customVariant: PropTypes.number,
  horizontalMargin: PropTypes.bool,
  cutLeft: PropTypes.bool,
  cutRight: PropTypes.bool,
}
CustomButton.defaultProps = {
  className: '',
  onClick: () => { },
  children: <></>,
  customVariant: 0,
  horizontalMargin: false,
  cutLeft: false,
  cutRight: false,
}

export default CustomButton
