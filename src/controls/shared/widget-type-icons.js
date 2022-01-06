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
import { MAP_LAYER_GEO_KEYS, COORD_KEYS } from '../../constants/map'


const mapIcons = {
  pie: Pie,
  bar: Bar,
  scatter: Scatter,
  line: Line,
  map: Map,
}

const Icons = ({ disabled }) => {
  const update = useStoreActions((actions) => actions.update)
  const current = useStoreState((state) => state.type)
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const numericColumns = useStoreState((state) => state.numericColumns)

  // TO DO (ERIKA) - this is just temporary for scatterplot
  // in the future we implement this with a complex validation process for specific geometry keys
  const mapIconAvailability = MAP_LAYER_GEO_KEYS.scatterplot.includes(mapGroupKey) &&
    numericColumns?.some(key => COORD_KEYS.latitude.includes(key)) &&
    numericColumns?.some(key => COORD_KEYS.longitude.includes(key))

  const iconButtonClass = (type) => clsx('outline-none focus:outline-none border-white border-custom-1 shadow-light-10 hover:shadow-light-20 h-10 w-10 p-1.5 flex items-center justify-center mr-3 rounded-xl transition-all duration-300 ease-in-out', {
    ['text-primary-500 hover:text-primary-600 active:text-primary-700 bg-primary-50 hover:bg-primary-100']: true,
    ['text-primary-700 hover:text-primary-700 bg-primary-200 hover:bg-primary-200']: type === current,
  })
  return (
    <div className='flex'>
      {
        Object.entries(mapIcons).map(([type, Icon], i) => (
          <CustomButton
            key={i}
            disabled={disabled || !(type !== 'map' || (type === 'map' && mapIconAvailability))}
            variant='borderless'
            className={iconButtonClass(type)}
            onClick={() => update({ type })}
          >
            <Icon className='overflow-visible w-full h-full fill-current' />
          </CustomButton>
        ))
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
