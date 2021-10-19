import React, { useState } from 'react'
import PropTypes from 'prop-types'

import WidgetControlCard from './widget-control-card'
import CustomToggle from './custom-toggle'


const ToggleableCard = ({ init, callback, title, altTitle, children }) => {
  const [toggle, setToggle] = useState(init)
  return (
    <>
      <WidgetControlCard
        title={toggle ? title : altTitle ?? title}
        titleExtra={
          <CustomToggle
            value={toggle}
            callback={(val) => {
              callback(val)
              setToggle(val)
            }}
          />
        }
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

ToggleableCard.propTypes = {
  altTitle: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  init: PropTypes.bool,
  title: PropTypes.string,
  callback: PropTypes.func.isRequired
}

ToggleableCard.defaultProps = {
  altTitle: null,
  children: [],
  init: true,
  title: '',
}

export default ToggleableCard
