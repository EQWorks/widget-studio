import React from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import CustomDropdown from './custom-dropdown'
import Range from './range'
import { renderItem } from '../../shared/util'
import types from '../../../constants/type-info'


const classes = makeStyles({
  dropdownMenu: {
    width: '12rem !important',
    overflow: 'visible !important',
  },
  dropdownButton: {
    width: '6.918rem !important',
    height: '1.75rem',
    color: getTailwindConfigColor('interactive-600'),
  },
})

const MapLayerSlider = ({ option, range }) => {
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)

  return (
    renderItem('Radius Size (px)',
      <CustomDropdown
        style = 'map'
        selectedString={
          (uniqueOptions[option][range? 'valueOptions' : 'value'].map(Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1,
          }).format)
          ).join('-')
        }
        classes={{
          menu: classes.dropdownMenu,
          button: classes.dropdownButton,
        }}
        placeholder={range ? 'Range' : 'Value'}
      >
        {range &&
          <Range
            update={val =>
              userUpdate({ uniqueOptions: { [option]: { [range? 'valueOptions' : 'value']: val } } })}
            value={uniqueOptions[option][range? 'valueOptions' : 'value']}
            min={types.map.uniqueOptions[option].min}
            max={types.map.uniqueOptions[option].max}
            step={types.map.uniqueOptions[option].step}
          />
        }
      </CustomDropdown>
    )
  )
}

MapLayerSlider.propTypes = {
  option: PropTypes.string.isRequired,
  range:  PropTypes.bool,
}

MapLayerSlider.defaultProps = {
  range: false,
}

export default MapLayerSlider
