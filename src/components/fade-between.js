import React, { useMemo, useRef, useState, Children } from 'react'
import PropTypes from 'prop-types'


const FadeBetween = ({ value, children }) => {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const [refs] = useState([ref1, ref2])

  const height = useMemo(() => Math.min(ref1.current?.clientHeight, ref2.current?.clientHeight), [ref1.current?.clientHeight, ref2.current?.clientHeight])
  const doScroll = useMemo(() => refs[1 - + value].current?.clientHeight > height, [refs, value, height])

  return (
    <div
      style={{ height }} // TODO convert to tailwind utility with JIT mode..?
      className={`grid ${doScroll ? 'overflow-y-scroll' : 'overflow-y-hidden'}`}
    >
      {
        Children.map(children, (child, i) =>
          i < 2 &&
          <div
            className={`row-span-full col-span-full transition duration-300 ease-in-out ${!!i && value || !i && !value ? 'opacity-0' : 'opacity-1'}`}
          >
            <div ref={refs[i]}>
              {child}
            </div>
          </div>
        )
      }
    </div>
  )
}

FadeBetween.propTypes = {
  value: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default FadeBetween
