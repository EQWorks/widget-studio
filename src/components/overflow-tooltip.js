import React, { Children, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@eqworks/lumen-labs'


const OverflowTooltip = ({ children, ...props }) => {
  const content = useRef(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const xOverflow = useMemo(() => content.current?.scrollWidth > content.current?.clientWidth, [content.current?.scrollWidth, content.current?.clientWidth])
  const renderChildren = Children.map(children, child => child)
  return (
    <>
      <span ref={content} className='invisible overflow-hidden max-h-0'>
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
