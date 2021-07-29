import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { Typography } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'
import { getChart } from './components/charts'

const useStyles = makeStyles(() => ({
  controlHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
}))

const WidgetControls = ({ rows, columns }) => {
  const classes = useStyles()
  const type = useStoreState((state) => state.initState.type)
  const getControl = getChart(type)({ columns, rows })

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
