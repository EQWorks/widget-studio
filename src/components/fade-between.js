import React, { useEffect, useCallback, useMemo, useRef, useState, Children } from 'react'
import PropTypes from 'prop-types'


const FadeBetween = ({ value, children }) => {
  // ref for the main container
  const container = useRef(null)
  // track the tallest element
  const [tallest, setTallest] = useState(0)
  // "refs" for determining the tallest element
  const measuredRefs = [
    useCallback((node) => setTallest(node?.scrollHeight <= node?.clientHeight), []),
    useCallback((node) => setTallest(node?.scrollHeight > node?.clientHeight), []),
  ]
  // only allow scroll if the taller element is
  const doScroll = useMemo(() => !value && tallest || value && !tallest, [tallest, value])
  // make sure to scroll back to top when toggling
  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = 0
    }
  }, [value])

  return (
    <div ref={container} className={`${doScroll ? 'overflow-auto' : 'overflow-hidden'} h-full w-full relative`} >
      {
        Children.map(children, (child, i) =>
          i < 2 &&
          <div
            ref={measuredRefs[i]}
            className={`w-full h-full absolute transition duration-300 ease-in-out ${!!i && value || !i && !value ? 'opacity-0 pointer-events-none' : 'opacity-1'}`}
          >
            {child}
          </div>
        )
      }
    </div >
  )
}

FadeBetween.propTypes = {
  value: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
}

export default FadeBetween
