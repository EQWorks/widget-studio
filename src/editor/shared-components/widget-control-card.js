import React from 'react'
import PropTypes from 'prop-types'

import CustomButton from '../../components/custom-button'
import { Trash } from '../../components/icons'
import clsx from 'clsx'


const WidgetControlCard = ({ title, titleExtra, description, clearable, showIfEmpty, children }) => (
  (children || showIfEmpty) &&
  <div className='rounded-sm my-4 border border-secondary-200'>
    {
      title &&
      <div className='p-2 py-1.5 bg-secondary-200 text-secondary-700 font-semibold text-sm flex align-center'>
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
              'text-xs text-secondary-500 hover:text-secondary-600',
              'bg-secondary-50 hover:bg-white',
              'shadow-light-10 hover:shadow-light-20',
            )}
          >
            <div className='flex items-center'>
              <span className='mr-1'>clear</span>
              <Trash size='md' className='fill-current text-secondary-600 hover:text-secondary-700' />
            </div>
          </CustomButton>
        }
      </div>
    }
    {
      children &&
      <div className='table w-full h-full'>
        {description &&
          <div className='table-cell w-0'>
            <div className='px-3 pt-2 pb-1 break-word italic text-xs text-secondary-400 tracking-wide'>
              {description}
            </div>
          </div>
        }
        <div className='table-row h-full'>
          <div className='h-full flex flex-col px-3 py-2'>
            {children}
          </div>
        </div>
      </div>
    }
  </div>
)

WidgetControlCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  title: PropTypes.string,
  titleExtra: PropTypes.node,
  description: PropTypes.string,
  clearable: PropTypes.bool,
  showIfEmpty: PropTypes.bool,
}

WidgetControlCard.defaultProps = {
  children: [],
  title: '',
  titleExtra: null,
  description: null,
  clearable: false,
  showIfEmpty: false,
}

export default WidgetControlCard
