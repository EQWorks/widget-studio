import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState } from '../../../store'
import CustomDropdown from './custom-dropdown'
import Range from './range'
import typeInfo from '../../../constants/type-info'


const classes = makeStyles({
// TO DO : bring together the two stylings for buttons when we do the final styling revision
  dropdownMenuChart: {
    width: '12rem !important',
    overflow: 'visible !important',
  },
  dropdownRootChart: {
    borderTopRightRadius: '0 !important',
    borderBottomRightRadius: '0 !important',
    borderRight: 'none !important',
  },
  dropdownMenuMap: {
    width: '12rem !important',
    overflow: 'visible !important',
  },
  dropdownButtonMap: {
    width: '6.918rem !important',
    height: '1.75rem',
    color: getTailwindConfigColor('interactive-600'),
  },
})

const SliderControl = ({ option, index, range, update, style }) => {
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const filters = useStoreState((state) => state.filters)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)

  const [{ min, max }, step] = useMemo(() => option ?
    [
      {
        min: typeInfo.map.uniqueOptions[option].min,
        max: typeInfo.map.uniqueOptions[option].max,
      },
      typeInfo.map.uniqueOptions[option].step,
    ] :
    [
      columnsAnalysis[filters[index]?.key] || {},
      1,
    ]
  , [option, columnsAnalysis, filters, index])

  const value = useMemo(() => option ?
    uniqueOptions[option][range? 'valueOptions' : 'value'] :
    filters[index]?.filter || [min, max]
  , [option, uniqueOptions, range, filters, index, max, min])

  return (
    <CustomDropdown
      selectedString={range ?
        (uniqueOptions[option]?.valueOptions || value).map(Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format)
          .join('-') :
        Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(uniqueOptions[option].value)
      }
      // NOTE - TO BE CHANGED: style 'map' or 'chart' has nothing to do witht the type of widget
      // it is used to differantiate the styling for the MapLayerDisplay section in the right panel
      classes={style === 'map' ?
        {
          menu: classes.dropdownMenuMap,
          button: classes.dropdownButtonMap,
        } :
        {
          root: classes.dropdownRootChart,
          menu: classes.dropdownMenuChart,
        }
      }
      placeholder={range ? 'Range' : 'Value'}
      disabled={!value}
      style={style}
    >
      {range &&
        <Range
          {...{ value, min, max, step, update }}
        />
      }
    </CustomDropdown>
  )
}

SliderControl.propTypes = {
  option: PropTypes.string,
  index: PropTypes.number,
  range: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  style: PropTypes.string.isRequired,
}

SliderControl.defaultProps = {
  option: '',
  index: null,
}

export default SliderControl
