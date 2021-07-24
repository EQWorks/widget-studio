import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { Typography } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'
import { getChart } from './components/charts'

const useStyles = makeStyles((theme) => ({
  controlHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
}))

const WidgetControls = ({ rows, columns }) => {
  const classes = useStyles()
  // const [revision, setRevision] = useState(0) // if chart needs to be resized
  const type = useStoreState((state) => state.widgets.initState.type)
  // const ready = useStoreState((state) => state.widgets.controllers.ready)
  const { props, getControl } = getChart(type)({ columns, rows })
  // const [showTable, setShowTable] = useState(false);

  return (
    <Paper>
      <div className={classes.controlHeader}>
        <Typography secondary={600} marginBottom={3} variant='h5'>
          Control Panel
        </Typography>
      </div>
      {/* TODO Add title option in control and pass current state to getControl() */}
      {getControl()}
    </Paper>
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
