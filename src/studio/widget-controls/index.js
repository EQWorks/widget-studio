import React, { createElement, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'

import Icons from './icons'

import BarControls from './controls/bar-controls'
import PieControls from './controls/pie-controls'
import LineControls from './controls/line-controls'
import ScatterControls from './controls/scatter-controls'

const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
}

const useStyles = makeStyles(() => ({
  container: {
    flexDirection: 'column',
    marginLeft: '1rem'
  },
  controlContainer: {
    // flexDirection: 'column',
    // marginLeft: '1rem'
  },
  get hiddenControlContainer() {
    return {
      ...this.controlContainer,
      opacity: 0
    }
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  controlHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
}))

const WidgetControls = ({ columns, dataLoading }) => {
  const classes = useStyles()
  const type = useStoreState((state) => state.type)

  return (
    <div className={classes.container}>
      {
        dataLoading &&
        <div className={classes.loaderContainer}>
          <Loader open />
        </div>
      }
      <div className={dataLoading ? classes.hiddenControlContainer : classes.controlContainer}>
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
