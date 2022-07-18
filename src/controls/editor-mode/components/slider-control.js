import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import CustomDropdown from './custom-dropdown'
import Slider from './slider'
import { quickNumericFormat } from '../../../util/numeric'


const classes = makeStyles({
// TO DO : bring together the two stylings for dropdown when we do the final styling revision
  dropdownMenuChart: {
    width: '14.882rem !important',
    overflow: 'visible !important',
  },
  dropdownRootChart: {
    borderTopRightRadius: '0 !important',
    borderBottomRightRadius: '0 !important',
    borderRight: 'none !important',
  },
  dropdownMenuMap: {
    width: '14.5rem !important',
    overflow: 'visible !important',
  },
  dropdownButtonMap: {
    width: '6.918rem !important',
    height: '1.75rem !important',
    color: getTailwindConfigColor('interactive-600'),
  },
  dropdownMenuRight: {
    width: '14.5rem',
    right: 0,
    overflowY: 'visible !important',
  },
  dropdownButtonRight: {
    width: '100%',
    height: '1.75rem',
    maxWidth: '9.5315rem',
    color: getTailwindConfigColor('interactive-600'),
  },
})

const SliderControl = ({ value, min, max, step, update, range, style }) => {
  const selectedString = useMemo(() => (
    range
      ? value.map(quickNumericFormat).join('-')
      : quickNumericFormat(value)
  ), [range, value])

  const getClasses = (type) => {
    switch (type) {
      case 'map':
        return {
          menu: classes.dropdownMenuMap,
          button: classes.dropdownButtonMap,
        }
      case 'chart':
        return {
          menu: classes.dropdownMenuChart,
          button: classes.dropdownButtonChart,
        }
      case 'right':
        return {
          menu: classes.dropdownMenuRight,
          button: classes.dropdownButtonRight,
        }
    }
  }

  return (
    <CustomDropdown
      {...{ selectedString, style }}
      // NOTE - TO BE CHANGED: style 'map' or 'chart' has nothing to do with the type of widget
      // it is used to differantiate the styling for the MapLayerDisplay section in the right panel
      classes={getClasses(style)}
      placeholder={range ? 'Range' : 'Value'}
      disabled={
        (Array.isArray(value) && !value[0] && !value[1]) ||
          (value !== min && !value)
      }
    >
      <Slider
        {...{ value, min, max, step, update }}
      />
    </CustomDropdown>
  )
}

SliderControl.propTypes = {
  range: PropTypes.bool.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  update: PropTypes.func.isRequired,
  style: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
}

SliderControl.defaultProps = {
  step: 1,
  min: null,
  max: null,
}

export default SliderControl
