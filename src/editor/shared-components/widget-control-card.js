import React from 'react'
import PropTypes from 'prop-types'


const WidgetControlCard = ({ title, children }) => (
  children &&
  <div className='overflow-hidden rounded-xs my-4 border border-secondary-200 '>
    {
      title &&
      <div className='p-2 py-1.5 bg-secondary-200 text-secondary-700 font-semibold text-sm flex align-center'>
        {`${title}:`}
      </div>
    }
    <div className='px-3 py-2'>
      {children}
    </div>
  </ div>
)

WidgetControlCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  title: PropTypes.string,
}

WidgetControlCard.defaultProps = {
  children: [],
  title: '',
}

export default WidgetControlCard
