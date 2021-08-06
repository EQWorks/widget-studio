import React, { createElement, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'

import Icons from './components/icons'

import BarControls from './components/charts/bar-controls'
import PieControls from './components/charts/pie-controls'
import LineControls from './components/charts/line-controls'
import ScatterControls from './components/charts/scatter-controls'

const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
}

const useStyles = makeStyles(() => ({
  controlContainer: {
    flexDirection: 'column'
  },
  controlHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
}))

const WidgetControls = ({ columns }) => {
  const classes = useStyles()
  const type = useStoreState((state) => state.initState.type)

  return (
    <div className={classes.controlContainer}>
      <div className={classes.controlHeader}>
        <Icons />
      </div>
      {type &&
        createElement(
          controls[type],
          { columns }
        )
      }
    </div>
  )
}

WidgetControls.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
}
WidgetControls.default = {
  columns: [],
  rows: [],
}

export default WidgetControls
