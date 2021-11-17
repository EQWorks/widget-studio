import { useState, useEffect, useRef } from 'react'
import debounce from 'lodash.debounce'
import { useResizeDetector } from 'react-resize-detector'


export default wait => {
  const [size, setSize] = useState({})
  const debouncedResize = useRef(debounce(setSize, wait))
  const { width, height, ref } = useResizeDetector()
  useEffect(() => {
    debouncedResize.current({ width, height })
  }, [width, height])
  return { ref, size }
}
