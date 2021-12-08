import React, { useState } from 'react'
import PropTypes from 'prop-types'

import WidgetControlCard from './widget-control-card'
import CustomToggle from '../../components/custom-toggle'


const ToggleableWidgetControlCard = ({ init, callback, title, altTitle, children, ...props }) => {
  const [toggle, setToggle] = useState(init)
  return (
    <>
      <WidgetControlCard
        showIfEmpty
        title={toggle ? title : altTitle ?? title}
        titleExtra={
          <CustomToggle
            value={toggle}
            onChange={(val) => {
              callback(val)
              setToggle(val)
            }}
          />
        }
        {...props}
      >
        {
          Array.isArray(children) ?
            (
              toggle ?
                children[0]
                :
                children.slice(1)

            )
            :
            (
              toggle &&
              children
            )

        }
      </WidgetControlCard>
    </>
  )
}

ToggleableWidgetControlCard.propTypes = {
  altTitle: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  init: PropTypes.bool,
  title: PropTypes.string,
  callback: PropTypes.func.isRequired,
}

ToggleableWidgetControlCard.defaultProps = {
  altTitle: null,
  children: [],
  init: true,
  title: '',
}

export default ToggleableWidgetControlCard
