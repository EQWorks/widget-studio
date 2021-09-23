import React, { useMemo, createElement } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Loader } from '@eqworks/lumen-ui'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'

import { useStoreState, useStoreActions } from '../../store'
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

const WidgetControls = () => {
  const classes = useStyles()

  const type = useStoreState((state) => state.type)
  const dataLoading = useStoreState((state) => state.dataLoading)
  const columns = useStoreState((state) => state.columns)
  const reset = useStoreActions(actions => actions.resetCurrent)

  const numericColumns = useMemo(() => (
    columns.filter(({ _, category }) => category === 'Numeric')
  ), [columns])

  const stringColumns = useMemo(() => (
    columns.filter(({ _, category }) => category === 'String')
  ), [columns])

  return (
    <div className={classes.container}>
      {
        dataLoading &&
        <div className={classes.loaderContainer}>
          <Loader open />
        </div>
      }
      <div className={dataLoading ? classes.hidden : classes.controlHeader}>
        <Icons disabled={!columns.length || dataLoading} />
      </div>
      {!dataLoading && type && columns &&
        <div className={classes.controls}>
          {createElement(controls[type], { numericColumns, stringColumns })}
        </div>
      }
      {
        !dataLoading &&
        <div className={classes.controlFooter}>
          <IconButton
            size='small'
            onClick={reset}
          >
            <Clear />
          </IconButton>
        </div>
      }
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
