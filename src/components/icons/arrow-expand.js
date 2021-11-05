import React from 'react'
import PropTypes from 'prop-types'


const iconSize = Object.freeze({
  lg: 'w-3.5 h-3.5',
  md: 'w-3 h-3',
  sm: 'w-2.5, h-2.5',
})
const ArrowExpand = ({ className, size, ...props }) => {
  return (
    <svg
      className={`${iconSize[size]} ${className}`}
      viewBox="0 0 10 10"
      fill="none"
      stroke="#3174D5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >

      <g transform="matrix(0.7142857142857143,0,0,0.7142857142857143,0,0)">
        <g>
          <path d="M13.5,8v4.5a1,1,0,0,1-1,1H1.5a1,1,0,0,1-1-1V1.5a1,1,0,0,1,1-1H6" strokeWidth="1" />
          <polyline points="10 0.5 13.5 0.5 13.5 4" strokeWidth="1"></polyline>
          <line x1="13.5" y1="0.5" x2="7" y2="7" strokeWidth="1"></line>
        </g>
      </g>
    </svg>
  )
}

ArrowExpand.propTypes = { className: PropTypes.string, size: PropTypes.string }
ArrowExpand.defaultProps = { className: '', size: 'lg' }

export default ArrowExpand
