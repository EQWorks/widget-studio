import React from 'react'
import PropTypes from 'prop-types'

// import { makeStyles } from '@material-ui/core/styles'
import TimelineIcon from '@material-ui/icons/Timeline'
import MapIcon from '@material-ui/icons/Map'
import IconButton from '@material-ui/core/IconButton'
import PieChartIcon from '@material-ui/icons/PieChart'
import InsertChartIcon from '@material-ui/icons/InsertChart'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'
import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'


const mapIcons = [
  { type: 'map', Component: MapIcon, disabled: true, cat: ['Geometry'], minAxis: 2 },
  { type: 'pie', Component: PieChartIcon, disabled: false, cat: ['Numeric', 'String'], minAxis: 2 },
  { type: 'bar', Component: InsertChartIcon, disabled: false, cat: ['Numeric', 'String', 'Date'], minAxis: 2 },
  { type: 'scatter', Component: ScatterPlotIcon, disabled: true, cat: ['Num', 'String', 'Date'], minAxis: 2 },
  { type: 'line', Component: TimelineIcon, disabled: false, cat: ['Date', 'Numeric', 'String'], minAxis: 2 },
]
const Icons = ({
  // categories = [],
  setType,
  current }) => {

  const genClicableIcon = () => mapIcons.map(({ Component, type, disabled }, i) => {
    /** at least 2 categories */ //TODO is this a good idea? maybe can plot with only numbers, or strings....
    // const isUsable = categories.length > 1 && cat.some((c) => categories.includes(c))

    return (
      // <IconButton key={i} onClick={() => setType(type)} disabled={!isUsable}>
      <IconButton key={i} onClick={() => setType(type)} disabled={disabled}>
        <Badge variant='dot' invisible={!current || type !== current} color='error'>
          <Component fontSize='large' color={disabled ? 'disabled' : 'primary'} />
          {/* <Component fontSize='large' color={isUsable ? 'primary' : 'disabled'}/> */}
        </Badge>
      </IconButton>
    )
  })

  return(
    <Grid container justify='center'>
      <Grid item>
        {genClicableIcon()}
      </Grid>
    </Grid>
  )
}

Icons.propTypes={
  // categories: PropTypes.array.isRequired,
  setType: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
}

export default Icons
