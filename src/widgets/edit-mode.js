import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { useStoreState } from 'easy-peasy'
import WidgetSelector from './widget-selector'
import WidgetRender from './widget-render'

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    marginTop: 10,
    width: '100%',
    height: '600px' // test determinate height
  },
}))

const EditMode = ({ rows, columns }) => {
  const classes = useStyles()
  const isDone = useStoreState((state) => state.widgets.isDone)

  return (
    <div className={classes.content}>
      {
        isDone ?
          <WidgetRender {...{ rows, columns }} />
          :
          <WidgetSelector {...{ columns }} />
      }
    </div >
  )
}

EditMode.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
}
EditMode.default = {
  columns: [],
  rows: [],
}

export default EditMode
