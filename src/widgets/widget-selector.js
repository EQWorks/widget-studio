import React from 'react'
import PropTypes from 'prop-types'
import { useStoreDispatch, useStoreState } from 'easy-peasy'
import { makeStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'

import { Loader, Typography, Button } from '@eqworks/lumen-ui'

import Icons from './components/icons'
import SelectColumns from './components/select-columns'

const useStyles = makeStyles((theme) => ({
  widgetSelectorContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.palette.common.white,
    borderRadius: 4,
    boxShadow: theme.shadows[4],
    width: '100%',
    height: '100%',
    '&:focus': {
      outline: 'none',
    },
    '&>*': {
      margin: theme.spacing(2, 0),
    },
  },
  typography: {
    marginLeft: '25%'
  },
  loader: {
    display: 'flex',
    position: 'absolute'
  }
}))

const WidgetSelector = ({ columns }) => {
  const classes = useStyles()
  const dispatch = useStoreDispatch()
  const isOpen = useStoreState((state) => state.widgets.initState.isOpen)

  return (
    <div className={classes.widgetSelectorContainer}>
      {
        !columns.length ?
          <Loader />
          :
          <Fade in={isOpen}>
            <div className={classes.paper}>
              <Typography className={classes.typography}>
                Select what goes in your X and Y axis
              </Typography>
              <SelectColumns
                {...{ columnsData: columns }}
              />
              <Typography className={classes.typography}>
                This data can be visualized with the following types of charts. Pick one:
              </Typography>
              <Icons />
              <Button
                onClick={() => {
                  dispatch({ type: 'WIDGETS', payload: { isOpen: false } })
                }}
              >
                Done
              </Button>
            </div>
          </Fade>
      }
    </div>
  )
}

WidgetSelector.propTypes = {
  columns: PropTypes.array,
  loaderIsOpen: PropTypes.bool
}
WidgetSelector.default = {
  results: [],
  loaderIsOpen: true
}

export default WidgetSelector
