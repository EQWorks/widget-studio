import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import Marquee from 'react-fast-marquee'


const OverflowMarquee = ({ children }) => {
  const content = useRef(null)

  const xOverflow = useMemo(() => content.current?.scrollWidth > content.current?.clientWidth, [content.current?.scrollWidth, content.current?.clientWidth])

  const renderChildren = React.Children.map(children, (child) => child)

  return (
    <>
      <span ref={content} className='invisible overflow-hidden max-h-0'>
        {renderChildren}
      </span>
      {
        xOverflow
          ? <Marquee gradient={false}>
            <span className='pr-3'>
              {renderChildren}
            </span>
          </Marquee>
          : renderChildren
      }
    </>
  )
}

OverflowMarquee.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OverflowMarquee
