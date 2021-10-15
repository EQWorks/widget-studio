import React, { useEffect, createElement } from 'react'

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
import styles from '../styles'


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

  const update = useStoreActions(actions => actions.update)
  const reset = useStoreActions(actions => actions.reset)
  const type = useStoreState((state) => state.type)
  const columns = useStoreState((state) => state.columns)

  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)
  const dataReady = useStoreState((state) => state.dataReady)

  useEffect(() => {
    update({ numericColumns: columns.filter(({ category }) => category === 'Numeric').map(({ name }) => name) })
    update({ stringColumns: columns.filter(({ category }) => category === 'String').map(({ name }) => name) })
  }, [columns, update])

  return (
    <div className={classes.container}>
      {
        dataSourceLoading &&
        <div className={classes.loaderContainer}>
          <Loader open />
        </div>
      }
      <div className={dataReady ? classes.hidden : classes.controlHeader}>
        <Icons disabled={!columns.length || !dataReady} />
      </div>
      {dataReady && type && columns &&
        <div className={classes.controls}>
          {createElement(controls[type])}
        </div>
      }
      {
        dataReady &&
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

export default WidgetControls
