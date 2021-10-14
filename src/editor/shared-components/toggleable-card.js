import React, { useState } from 'react'
import PropTypes from 'prop-types'
import WidgetControlCard from './widget-control-card'
import CustomToggle from './custom-toggle'


const ToggleableCard = ({ init, update, title, altTitle, children }) => {
  const [toggle, setToggle] = useState(init)
  return (
    <>
      <WidgetControlCard
        title={toggle ? title : altTitle ?? title}
        titleExtra={
          <CustomToggle
            value={toggle}
            update={(val) => {
              update(val)
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
  children: PropTypes.oneOfType([PropTypes.elementType, PropTypes.array]),
  init: PropTypes.bool,
  title: PropTypes.string,
  update: PropTypes.func
}

export default ToggleableCard
