import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import CustomButton from '../components/custom-button'
import clsx from 'clsx'


const LabeledToggle = ({ labels, icons, value, update, className }) => (
  <div className={`flex flex-row divide-x ${className}`} >
    {
      labels.map((l, i) => {
        const selected = (i !== 0 && value) || (i === 0 && !value)
        return <div key={i}>
          <CustomButton
            className={`border-none uppercase cursor-${selected ? 'default' : 'pointer'}`}
            disabled={selected}
            onClick={() => update(!value)}
          >
            <span className={clsx('px-4 flex items-center transition duration-500 ease-in-out', {
              'hover:text-neutral-400 text-neutral-300': !selected,
              'text-primary-600': selected,
            })}>
              {
                icons[i] &&
                createElement(icons[i], { className: 'fill-current pr-0.5 mr-1' })
              }
              <span className='text-xs font-semibold tracking-wider'>{l}</span>
            </span>
          </CustomButton>
        </div>
      })
    }
  </div >
)

LabeledToggle.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  icons: PropTypes.arrayOf(PropTypes.elementType).isRequired,
  value: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  className: PropTypes.string,
}

LabeledToggle.defaultProps = {
  className: '',
}

export default LabeledToggle
