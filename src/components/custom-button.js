import React from 'react'
import PropTypes from 'prop-types'
import { Button, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  base: {
    fontFamily: 'Open Sans,sans-serif',
  },
  variant3: {
    padding: '0.1rem 0.2rem',
  },
})

const CustomButton = ({ className, onClick, children, customVariant, ...props }) => {
  switch (customVariant) {
    case 1: return <Button
      className={`outline-none focus:outline-none ${className}`}
      classes={{
        button: classes.base,
      }}
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}

      {...props}
    >
      {children}
    </Button>
    case 2: return <Button
      classes={{ button: `${classes.base} outline-none focus:outline-none uppercase px-1.5 py-1.5 tracking-widest` }}
      type='primary'
      variant='borderless'
      size='md'
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}
      {...props}
    >
      <div className='flex'>
        {children}
      </div>
    </Button >
    case 3: return <Button
      classes={{ button: `${classes.base} ${classes.variant3} outline-none focus:outline-none uppercase tracking-widest` }}
      type='primary'
      variant='outlined'
      size='md'
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}
      {...props}
    >
      <div className='flex'>
        {children}
      </div>
    </Button >
    default: return <Button
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}
      {...props}
    />
  }
}

CustomButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  customVariant: PropTypes.number,
}
CustomButton.defaultProps = {
  className: '',
  onClick: () => { },
  children: <></>,
  customVariant: 1,
}

export default CustomButton
