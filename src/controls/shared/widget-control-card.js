import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import useResizeObserver from '@react-hook/resize-observer'
import clsx from 'clsx'

import { useStoreState, useStoreActions } from '../../store'
import CustomButton from '../../components/custom-button'
import { Trash } from '../../components/icons'


const WidgetControlCard = ({ title, titleExtra, description, clearable, showIfEmpty, children, grow, ignore, className }) => {
  const controlsWidth = useStoreState((state) => state.ui.controlsWidth)
  const nestedUpdate = useStoreActions((actions) => actions.nestedUpdate)
  const target = useRef(null)
  useResizeObserver(target, () => {
    if (!ignore) {
      const width = target.current?.[grow ? 'scrollWidth' : 'clientWidth']
      if (!controlsWidth || width > controlsWidth) {
        nestedUpdate({ ui: { controlsWidth: width } })
      }
    }
  })

  return (
    (children || showIfEmpty) &&
    <div ref={target} className={`rounded-sm my-1 border border-neutral-100 ${className}`}>
      {
        title &&
        <div className='p-2 py-1.5 bg-neutral-100 text-secondary-700 font-semibold text-sm flex align-center'>
          <div className='flex-1'>
            {`${title}:`}
          </div>
          {titleExtra}
          {
            clearable &&
            <CustomButton
              onClick={() => alert('not implemented')}
              className={clsx(
                'flex flex-row items-center font-medium rounded-sm tracking-wider uppercase px-1.5 py-0.5 transition-all ease-in-out duration-300',
                'text-xs text-secondary-600 hover:text-secondary-800',
                'bg-secondary-50',
                'shadow-light-10 hover:shadow-light-20',
              )}
            >
              <div className='flex items-center'>
                <span className='mr-1'>clear</span>
                <Trash size='md' className='fill-current text-secondary-600 hover:text-secondary-800' />
              </div>
            </CustomButton>
          }
        </div>
      }
      {
        children &&
        (description
          ? <>
            <div className='table w-full'>
              <div className='table-cell w-0'>
                <div className='px-3 pt-2 pb-1 break-word italic text-xs text-secondary-600 tracking-wide'>
                  {description}
                </div>
              </div>
              <div className='table-row w-full'>
                <div className='w-full h-full flex flex-col px-3 py-2'>
                  {children}
                </div>
              </div>
            </div>
          </>
          : <div className='flex flex-col px-3 py-2'>
            {children}
          </div>
        )
      }
    </div>
  )
}

WidgetControlCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  title: PropTypes.string,
  titleExtra: PropTypes.node,
  description: PropTypes.string,
  clearable: PropTypes.bool,
  showIfEmpty: PropTypes.bool,
  grow: PropTypes.bool,
  ignore: PropTypes.bool,
  className: PropTypes.string,
}

WidgetControlCard.defaultProps = {
  children: [],
  title: '',
  titleExtra: null,
  description: null,
  clearable: false,
  showIfEmpty: false,
  grow: false,
  ignore: false,
  className: '',
}

export default WidgetControlCard
