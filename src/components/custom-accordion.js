import React, { useState, useEffect, createElement } from 'react'
import PropTypes from 'prop-types'

import { Icons } from '@eqworks/lumen-labs'
import { useResizeDetector } from 'react-resize-detector'
import clsx from 'clsx'

import CustomButton from './custom-button'


const xPadding = '1rem'

const CustomAccordion = ({ expandedWidth, collapsedWidth, speed, disabled, title, footer, icon, open, toggle, children }) => {
  const { height, ref } = useResizeDetector()
  const [fullyOpen, setFullyOpen] = useState(open)
  useEffect(() => {
    if (open) {
      setTimeout(() => setFullyOpen(true), 2 * speed)
    } else {
      setFullyOpen(false)
    }
  }, [open, speed])

  const transition = `ease-in-out duration-${speed}`

  return (
    <div
      ref={ref}
      className={`shadow-blue-40 relative whitespace-nowrap relative z-20 border-l-2 border-neutral-100 transition-width ${transition} flex justify-end`}
      style={{
        height: fullyOpen ? 'auto' : height,
        width: open ? `clamp(20rem, calc(${expandedWidth}px + 2*${xPadding}), 30rem)` : collapsedWidth,
      }}
    >
      {
        disabled &&
        <div className='absolute z-30 bg-secondary-50 opacity-50 w-full h-full' />
      }
      <CustomButton
        variant='borderless'
        style={{ width: collapsedWidth }}
        className={clsx(`absolute justify-center border-none h-full transition-opacity ${transition}`, {
          'pointer-events-none opacity-0': open,
          'opacity-1': !open,
        })}
        onClick={toggle}
      >
        {createElement(icon ?? Icons.ArrowLeft, {
          size: 'md',
          className: 'h-full stroke-current text-secondary-600 w-full p-5',
        })}
      </CustomButton>
      <div
        className={clsx(`transition-filter ${transition}`, {
          'filter blur-sm': disabled,
          'w-0': !open,
          'w-full': open,
        })}
      >
        <div className={`px-${xPadding} py-3 border-b border-neutral-100 flex flex-col items-center`}>
          <div className='w-full flex flex-row'>
            <span className='flex-1 font-bold text-secondary-900 text-md' >{title}</span >
            <CustomButton
              variant='borderless'
              className='border-none'
              onClick={toggle}
            >
              <Icons.Close size='md' className='fill-current text-secondary-600 h-min w-auto' />
            </CustomButton>
          </div>
        </div >
        <div className={`px-${xPadding} py-2`}>
          {children}
        </div >
        <div className={`px-${xPadding} flex py-2 pt-3 border-t border-neutral-100`}>
          {footer}
        </div>
      </div >
    </div >
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
  expandedWidth: PropTypes.number.isRequired,
  collapsedWidth: PropTypes.number,
  speed: PropTypes.number,
}
CustomAccordion.defaultProps = {
  disabled: false,
  title: '',
  children: null,
  footer: null,
  icon: null,
  collapsedWidth: '4rem',
  speed: 300,
}

export default CustomAccordion
