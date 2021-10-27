import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@eqworks/lumen-labs'


const CustomSwitch = ({ labels, icons, value, update, className }) => (
  <div className={`flex flex-row divide-x ${className}`} >
    {
      labels.map((l, i) => {
        const selected = (i !== 0 && value) || (i === 0 && !value)
        return <div key={i}>
          <Button
            className={`border-none uppercase cursor-${selected ? 'default' : 'pointer'}`}
            disabled={selected}
            onClick={() => update(!value)}
          >
            <span className={`px-4 flex ${!selected && 'hover:text-secondary-600'} items-center text-${selected ? 'primary' : 'secondary'}-500`}>
              {
                icons[i] &&
                createElement(icons[i], { className: 'fill-current pr-0.5 mr-1' })
              }
              <span className='text-xs font-semibold tracking-wider'>{l}</span>
            </span>
          </Button>
        </div>
      })
    }
  </div >
)

CustomSwitch.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  icons: PropTypes.arrayOf(PropTypes.elementType).isRequired,
  value: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  className: PropTypes.string,
}

CustomSwitch.defaultProps = {
  className: '',
}

export default CustomSwitch
