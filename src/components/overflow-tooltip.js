import React, { useState, Children, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Tooltip } from '@eqworks/lumen-labs'
import useResizeObserver from '@react-hook/resize-observer'


const classes = makeStyles({
  testChildren: {
    visibility: 'hidden',
    height: '0px',
    display: 'flex',
  },
  tooltipChildren: {
    maxWidth: '100%',
    overflow: 'hidden',
    '&> *': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
})

const OverflowTooltip = ({ children, ...props }) => {
  const target = useRef(null)
  const [xOverflow, setXOverflow] = useState(true)
  useResizeObserver(target, () => setXOverflow(target.current?.scrollWidth > target.current?.clientWidth))
  const renderChildren = Children.map(children, child => child)
  return (
    <>
      <span ref={target} className={classes.testChildren}>
        {renderChildren}
      </span>
      {
        xOverflow
          ? <Tooltip {...props} >
            <span className={classes.tooltipChildren}>
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
