import React, { createElement } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, Icons, makeStyles } from '@eqworks/lumen-labs'

import CustomButton from './custom-button'
import MutedBarrier from '../controls/shared/muted-barrier'


const SPEED = '400ms'
const WIDTH = '24rem'
const COLLAPSED_WIDTH = '4rem'
const Y_PADDING = '0.5rem'
const X_PADDING = '1rem'

const useStyles = ({ open }) => makeStyles({
  innerContainer: {
    position: 'absolute',
    overflowX: 'clip',
    right: 0,
    top: 0,
    whiteSpace: 'nowrap',
    borderLeftWidth: '2px',
    borderColor: getTailwindConfigColor('neutral-100'),
    display: 'flex',
    minHeight: '100%',
  },
  outerContainer: {
    transitionProperty: 'width',
    overflowY: 'auto',
    height: '100%',
    position: 'relative',
  },
  transition: {
    transitionDuration: SPEED,
    transitionTimingFunction: 'ease',
  },
  padded: {
    padding: `${Y_PADDING} ${X_PADDING}`,
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  barrier: {
    position: 'absolute',
    zIndex: 30,
    background: getTailwindConfigColor('secondary-50'),
    opacity: 0.5,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    transitionProperty: 'opacity, filter',
    opacity: + open,
    width: '100%',
    minHeight: '100%',
    ...(!open && { pointerEvents: 'none' }),
  },
  headerContainer: {
    padding: `0.75rem ${X_PADDING}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: `1px solid ${getTailwindConfigColor('neutral-100')}`,
  },
  header: {
    display: 'flex',
    width: '100%',
  },
  footer: {
    marginTop: 'auto',
    borderTop: `1px solid ${getTailwindConfigColor('neutral-100')}`,
  },
  button: {
    border: 'none',
  },
  tallIcon: {
    padding: '1.25rem',
    width: '100% !important',
    height: '100% !important',
  },
  tallButton: {
    position: 'absolute',
    height: '100%',
    width: COLLAPSED_WIDTH,
    transitionProperty: 'opacity, background',
    opacity: + !open,
    ...(open && { pointerEvents: 'none' }),
    '& svg': {
      transition: `stroke ${SPEED}`,
      stroke: getTailwindConfigColor('secondary-600'),
    },
    '&:hover': {
      background: getTailwindConfigColor('secondary-50'),
      '& svg': {
        stroke: getTailwindConfigColor('secondary-800'),
      },
    },
  },
  title: {
    flex: 1,
    color: getTailwindConfigColor('secondary-900'),
    fontWeight: 'bold',
  },
})

const CustomAccordion = ({ open, disabled, title, footer, icon, toggle, children }) => {
  const width = WIDTH
  const classes = useStyles({ open, disabled, width })

  return (
    <MutedBarrier muted={disabled} className='overflow-y-auto'>
      <div
        className={`${classes.outerContainer} ${classes.transition}`}
        style={{ width: open ? width : COLLAPSED_WIDTH }}
      >
        <div
          className={`${classes.innerContainer} ${classes.transition} shadow-blue-40`}
          style={{ width: open ? '100%' : COLLAPSED_WIDTH }}
        >
          {disabled && <div className={classes.barrier} />}
          <CustomButton
            variant='borderless'
            className={`${classes.transition} ${classes.button} ${classes.tallButton}`}
            onClick={toggle}
          >
            {createElement(icon ?? Icons.ArrowLeft, {
              size: 'md',
              className: `${classes.tallIcon}`,
            })}
          </CustomButton>
          <div className={`${classes.transition} ${classes.contentContainer}`} >
            <div className={classes.headerContainer} >
              <div className={classes.header} >
                <span className={classes.title} >{title}</span >
                <CustomButton
                  variant='borderless'
                  className={classes.button}
                  onClick={toggle}
                >
                  <Icons.Close size='md' className='fill-current text-secondary-600 h-min w-auto' />
                </CustomButton>
              </div>
            </div >
            <div className={classes.padded} >
              {children}
            </div >
            <div className={`${classes.footer} ${classes.padded}`}>
              {footer}
            </div>
          </div >
        </div >
      </div>
    </MutedBarrier>
  )
}

CustomAccordion.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.node,
  icon: PropTypes.elementType,
  children: PropTypes.node,
  footer: PropTypes.node,
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}
CustomAccordion.defaultProps = {
  disabled: false,
  title: '',
  children: null,
  footer: null,
  icon: null,
}

export default CustomAccordion
