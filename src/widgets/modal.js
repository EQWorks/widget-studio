import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { Typography, Button } from '@eqworks/lumen-ui'
import Icons from './components/icons'
import SelectColumns from './components/select-columns'


const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: 'flex',
    // marginTop: 100,
    // height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: theme.palette.common.white,
    borderRadius: 4,
    boxShadow: theme.shadows[4],
    width: '50%',
    padding: theme.spacing(4),
    '&:focus': {
      outline: 'none',
    },
    '&>*': {
      margin: theme.spacing(2, 0),
    },
  },
  typography: { marginLeft: '25%' }
}))

const WidgetSelector = ({ xAxis, setXAxis, yAxis, setYAxis, type, setType, columns, isOpen, setIsOpen }) => {
  const classes = useStyles()

  // const regexGeo = /(geo|fsa|lat|lon)/gi
  /** array of unique categories based on query columns
   * looks like categories = ["Numeric", "String", "Geometry"]
   */
  // const categories = [...new Set(
  //   columns.map(({ type, data: { category = '', key = '' } = {} }) => {
  //     if (type === 'function') {
  //       return 'Numeric'
  //     }
  //     // if key has `geo` or lat or lon or fsa add 'Geometry'
  //     return key.match(regexGeo) ? 'Geometry' : category
  //   })
  // )] || []

  return (
    <Modal
      className={classes.modalContainer}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isOpen}>
        <div className={classes.paper}>
          <Typography className={classes.typography}>
            Select what goes in your X and Y axis
          </Typography>
          <SelectColumns
            {...{ columnsData: columns, xAxis, setXAxis, yAxis, setYAxis }}
          />
          <Typography className={classes.typography}>
            This data can be visualized with the following types of charts. Pick one:
          </Typography>
          <Icons
          // categories={categories}
            setType={setType}
            current={type}
          />
          <Button onClick={() => {
            setIsOpen(false)
            // setIsDone(true)
          }}>
          Done
          </Button>
        </div>
      </Fade>
    </Modal>
  )
}


WidgetSelector.propTypes = {
  columns: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  xAxis: PropTypes.string.isRequired,
  setXAxis: PropTypes.func.isRequired,
  yAxis: PropTypes.string.isRequired,
  setYAxis: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  setType: PropTypes.func.isRequired,
}
WidgetSelector.default = {
  results: [],
}

export default WidgetSelector
