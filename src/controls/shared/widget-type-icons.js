import React from 'react'
import PropTypes from 'prop-types'

import clsx from 'clsx'

import CustomButton from '../../components/custom-button'
import {
  Pie,
  Bar,
  Line,
  Scatter,
  Map,
} from '../../components/icons'
import { useStoreActions, useStoreState } from '../../store'
import types from '../../constants/types'


const mapIcons = {
  [types.PIE]: Pie,
  [types.BAR]: Bar,
  [types.SCATTER]: Scatter,
  [types.LINE]: Line,
  [types.MAP]: Map,
}

const Icons = ({ disabled }) => {
  const update = useStoreActions((actions) => actions.update)
  const current = useStoreState((state) => state.type)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)

  const mapIconAvailability = validMapGroupKeys.length > 0

  const iconButtonClass = (isCurrent, isDisabled) => clsx('outline-none focus:outline-none border-white border-custom-1 shadow-light-10 hover:shadow-light-20 h-10 w-10 p-1.5 flex items-center justify-center mr-3 rounded-xl transition-all duration-300 ease-in-out', {
    ['text-primary-500 hover:text-primary-600 active:text-primary-700 bg-primary-50 hover:bg-primary-100']: !isCurrent && !isDisabled,
    ['text-primary-700 hover:text-primary-700 bg-primary-200 hover:bg-primary-200']: isCurrent,
    ['pointer-events-none text-secondary-400 bg-secondary-100']: isDisabled,
  })
  return (
    <div className='flex'>
      {
        Object.entries(mapIcons).map(([type, Icon], i) => {
          const isCurrent = type === current
          const isDisabled = disabled || (type === types.MAP && !mapIconAvailability)
          return (
            <CustomButton
              key={i}
              disabled={isDisabled}
              variant='borderless'
              className={iconButtonClass(isCurrent, isDisabled)}
              onClick={() => update({ type })}
            >
              <Icon className='overflow-visible w-full h-full fill-current' />
            </CustomButton>
          )
        }
        )
      }
    </div >
  )
}

Icons.propTypes = {
  disabled: PropTypes.bool,
}
Icons.defaultProps = {
  disabled: false,
}

export default Icons
