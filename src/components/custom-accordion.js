import React, { createElement } from 'react'
import PropTypes from 'prop-types'

import { Icons } from '@eqworks/lumen-labs'

import CustomButton from './custom-button'
import { useResizeDetector } from 'react-resize-detector'


const CustomAccordion = ({ disabled, direction, title, footer, icon, open, toggle, children }) => {
  const { height, ref } = useResizeDetector()

  return (
    <>
      {
        direction === 'vertical'
          ? <>
            <div style={{ height }} className={`shadow-blue-20 border-l border-neutral-100 overflow-hidden transition-width duration-200 ease-in ${open ? 'w-0 border-l-none' : 'w-16 delay-500'}`}>
              <CustomButton
                variant='borderless'
                className={'w-full justify-center border-none h-full'}
                onClick={toggle}
              >
                {createElement(icon ?? Icons.ArrowLeft, {
                  size: 'md',
                  className: 'h-full stroke-current text-secondary-500 w-full p-5',
                })}
              </CustomButton>
            </div>
            <div ref={ref} className={`shadow-blue-40 whitespace-nowrap border-l border-neutral-100 transition-max-width overflow-x-hidden ease-in-out flex justify-end duration-1000 ${open ? 'max-w-full' : 'max-w-0'}`}>
              {
                disabled &&
                <div className='absolute z-30 bg-secondary-50 opacity-50 w-full h-full' />
              }
              <div className={`overflow-x-hidden transition-filter duration-1000 ease-in-out ${disabled ? 'filter blur-sm' : ''}`} >
                <div className={'py-3 px-4 border-b border-neutral-100 flex flex-col items-center'}>
                  <div className='w-full flex flex-row'>
                    <span className='flex-1 font-bold text-secondary-800 text-md' >{title}</span >
                    <CustomButton
                      variant='borderless'
                      className='border-none'
                      onClick={toggle}
                    >
                      <Icons.Close size='md' className='fill-current text-secondary-500 h-min w-auto' />
                    </CustomButton>
                  </div>
                </div >
                <div className='py-2 px-4'>
                  {children}
                </div >
                <div className='flex py-2 pt-3 px-4 border-t border-neutral-100'>
                  {footer}
                </div>
              </div >
            </div >
          </>
          : <>
            <div className={`relative z-10 border-neutral-100 overflow-hidden ${open ? 'transition-height duration-200 ease-in-out h-0 border-t-none' : 'h-16 border-t-2'}`}>
              <CustomButton
                variant='borderless'
                className={'w-full justify-center border-none h-full'}
                onClick={toggle}
              >
                {createElement(icon ?? Icons.ChevronUp, {
                  size: 'md',
                  className: 'h-full stroke-current text-secondary-500 w-full p-5',
                })}
              </CustomButton>
            </div>
            <div ref={ref} className={`w-full relative z-10 border-neutral-100 overflow-hidden ${open ? 'h-auto border-t-2' : 'h-0 border-none'}`}>
              {
                disabled &&
                <div className='absolute z-30 bg-secondary-50 opacity-50 w-full h-full' />
              }
              <div className={`w-full overflow-y-hidden transition-filter duration-1000 ease-in-out ${disabled ? 'filter blur-sm' : ''}`} >
                <div className={'px-4 py-3 flex flex-col items-center'}>
                  <div className='w-full flex flex-row'>
                    <span className='flex-1 font-bold text-secondary-800 text-md' >{title}</span >
                    <CustomButton
                      variant='borderless'
                      className='border-none'
                      onClick={toggle}
                    >
                      <Icons.Close size='md' className='fill-current text-secondary-500' />
                    </CustomButton>
                  </div>
                  {children}
                </div >
              </div >
            </div >
          </>
      }
    </>
  )
}

CustomAccordion.propTypes = {
  disabled: PropTypes.bool,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  title: PropTypes.node,
  icon: PropTypes.elementType,
  children: PropTypes.node,
  footer: PropTypes.node,
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}
CustomAccordion.defaultProps = {
  disabled: false,
  direction: 'vertical',
  title: '',
  children: null,
  footer: null,
  icon: null,
}

export default CustomAccordion
