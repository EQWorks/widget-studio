import React, { useState, Children, useRef } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@eqworks/lumen-labs'
import useResizeObserver from '@react-hook/resize-observer'


const OverflowTooltip = ({ children, ...props }) => {
  const target = useRef(null)
  const [xOverflow, setXOverflow] = useState(true)
  useResizeObserver(target, () => setXOverflow(target.current?.scrollWidth > target.current?.clientWidth))
  const renderChildren = Children.map(children, child => child)
  return (
    <>
      <span ref={target} className='invisible h-0 flex'>
        {renderChildren}
      </span>
      {
        xOverflow
          ? <Tooltip {...props} >
            <span className='max-w-full overflow-hidden children:truncate'>
              {renderChildren}
            </span>
          </Tooltip>
          : renderChildren
      }
    </>
  )
}

OverflowTooltip.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OverflowTooltip
