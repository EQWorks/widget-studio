import React from 'react'

import PropTypes from 'prop-types'
import TimelineIcon from '@material-ui/icons/Timeline'
import MapIcon from '@material-ui/icons/Map'
import IconButton from '@material-ui/core/IconButton'
import PieChartIcon from '@material-ui/icons/PieChart'
import InsertChartIcon from '@material-ui/icons/InsertChart'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'

import { useStoreActions, useStoreState } from '../../store'

const mapIcons = [
  { type: 'map', Component: MapIcon, available: false, cat: ['Geometry'], minAxis: 2 },
  { type: 'pie', Component: PieChartIcon, available: true, cat: ['Numeric', 'String'], minAxis: 2 },
  { type: 'bar', Component: InsertChartIcon, available: true, cat: ['Numeric', 'String', 'Date'], minAxis: 2 },
  { type: 'scatter', Component: ScatterPlotIcon, available: true, cat: ['Num', 'String', 'Date'], minAxis: 2 },
  { type: 'line', Component: TimelineIcon, available: true, cat: ['Date', 'Numeric', 'String'], minAxis: 2 },
]
const Icons = ({ disabled }) => {

  const updateStore = useStoreActions((actions) => actions.update)
  const current = useStoreState((state) => state.type)
  return (
    mapIcons.map(({ Component, type, available }, i) => {
      return (
        <IconButton key={i} onClick={() => updateStore({ type })} disabled={disabled || !available}>
          <Component fontSize='large' color={
            disabled || !available ?
              'disabled'
              :
              type === current ?
                'primary'
                :
                'secondary'
          } />
        </IconButton>
      )
    })
  )
}

Icons.propTypes = {
  disabled: PropTypes.bool,
}

export default Icons
