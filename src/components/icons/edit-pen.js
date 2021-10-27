import React from 'react'
import PropTypes from 'prop-types'


const iconSize = Object.freeze({
  lg: 'w-3.5 h-3.5',
  md: 'w-3 h-3',
  sm: 'w-2.5, h-2.5',
})
const EditPen = ({ className, size, ...props }) => {
  return (
    <svg
      className={`${iconSize[size]} ${className}`}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8.39286 8.92358H0.535714C0.393634 8.92358 0.257373 8.98003 0.156907 9.08049C0.0564412 9.18096 0 9.31722 0 9.4593C0 9.60138 0.0564412 9.73764 0.156907 9.83811C0.257373 9.93857 0.393634 9.99501 0.535714 9.99501H8.39286C8.53494 9.99501 8.6712 9.93857 8.77166 9.83811C8.87213 9.73764 8.92857 9.60138 8.92857 9.4593C8.92857 9.31722 8.87213 9.18096 8.77166 9.08049C8.6712 8.98003 8.53494 8.92358 8.39286 8.92358Z" />
      <path d="M9.68643 1.06643L8.92857 0.308569C8.7244 0.113943 8.45315 0.00537109 8.17107 0.00537109C7.889 0.00537109 7.61775 0.113943 7.41357 0.308569L2.62214 5.09928C2.5705 5.15124 2.53609 5.21782 2.52357 5.29L2.14286 7.43643C2.13346 7.48835 2.13568 7.54172 2.14937 7.59268C2.16306 7.64364 2.18787 7.69094 2.22202 7.73117C2.25617 7.7714 2.29881 7.80356 2.34688 7.82534C2.39494 7.84713 2.44724 7.85798 2.5 7.85714C2.52085 7.85734 2.54167 7.85542 2.56214 7.85143L4.70857 7.47285C4.78083 7.46014 4.84742 7.42547 4.89929 7.37357L9.69 2.58285C9.89086 2.38193 10.0037 2.10946 10.0037 1.82535C10.0037 1.54125 9.89086 1.26878 9.69 1.06785L9.68643 1.06643Z" />
    </svg >
  )
}

EditPen.propTypes = { className: PropTypes.string, size: PropTypes.string }
EditPen.defaultProps = { className: '', size: 'lg' }

export default EditPen
