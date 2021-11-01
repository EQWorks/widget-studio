import React from 'react'

import PropTypes from 'prop-types'
import TimelineIcon from '@material-ui/icons/Timeline'
import MapIcon from '@material-ui/icons/Map'
import IconButton from '@material-ui/core/IconButton'
import PieChartIcon from '@material-ui/icons/PieChart'
import InsertChartIcon from '@material-ui/icons/InsertChart'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'

import { useStoreActions, useStoreState } from '../../store'
import { MAP_LAYER_GEO_KEYS, COORD_KEYS } from '../../constants/map'


const Icons = ({ disabled }) => {
  const updateStore = useStoreActions((actions) => actions.update)
  const current = useStoreState((state) => state.type)
  const groupKey = useStoreState((state) => state.groupKey)
  const rows = useStoreState((state) => state.rows)

  const dataKeys = rows?.length ? Object.keys(rows[0]) : null
  // TO DO (ERIKA) - this is just temporary for scatterplot and available mvt tile layers
  // in the future we implement this with a complex validation process for specific geometry keys
  const mapIconAvailability = (MAP_LAYER_GEO_KEYS.scatterplot.includes(groupKey) &&
      dataKeys?.some(key => COORD_KEYS.latitude.includes(key)) &&
      dataKeys?.some(key => COORD_KEYS.longitude.includes(key))) ||
    MAP_LAYER_GEO_KEYS.MVT.includes(groupKey)

  const mapIcons = [
    { type: 'map', Component: MapIcon, available: mapIconAvailability, cat: ['Geometry'], minAxis: 2 },
    { type: 'pie', Component: PieChartIcon, available: true, cat: ['Numeric', 'String'], minAxis: 2 },
    { type: 'bar', Component: InsertChartIcon, available: true, cat: ['Numeric', 'String', 'Date'], minAxis: 2 },
    { type: 'scatter', Component: ScatterPlotIcon, available: true, cat: ['Num', 'String', 'Date'], minAxis: 2 },
    { type: 'line', Component: TimelineIcon, available: true, cat: ['Date', 'Numeric', 'String'], minAxis: 2 },
  ]

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

Icons.defaultProps = {
  disabled: false,
}

export default Icons
