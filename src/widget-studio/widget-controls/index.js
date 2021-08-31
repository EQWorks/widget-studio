import React, { createElement } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-ui'

import { useStoreState } from '../../store'
import BarControls from './controls/bar-controls'
import PieControls from './controls/pie-controls'
import LineControls from './controls/line-controls'
import ScatterControls from './controls/scatter-controls'
import Icons from './icons'
import styles from './styles'

const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
}

// put styles in separate file for readability
const useStyles = makeStyles(styles)

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
          <Icons disabled={!columns.length || dataLoading} />
        </div>
        {type && columns &&
          // render the appropriate controls
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
  columns: PropTypes.array,
  dataLoading: PropTypes.bool,
}
WidgetControls.default = {
  columns: [],
}

export default WidgetControls
