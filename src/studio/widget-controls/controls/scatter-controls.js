import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../custom-select'

const useStyles = makeStyles({
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
})

const ScatterControls = ({ columns }) => {
  const classes = useStyles()

  const x = useStoreState((state) => state.scatter.x)
  const y = useStoreState((state) => state.scatter.y)
  const indexBy = useStoreState((state) => state.scatter.indexBy)

  const setLineState = useStoreActions(actions => actions.scatter.update)
  const reset = useStoreActions(actions => actions.resetCurrent)

  // TODO data inference rather than using 'category' attribute
  const [numericColumns, setNumericColumns] = useState([])
  const [stringColumns, setStringColumns] = useState([])
  useEffect(() => {
    setNumericColumns(columns.filter(({ _, category }) => category === 'Numeric'))
    setStringColumns(columns.filter(({ _, category }) => category === 'String'))
  }, [columns])

  return (
    <div className={classes.controls}>
      <>
        <CustomSelect
          title='X Key'
          data={numericColumns.filter(({ name, _ }) => !y.includes(name))}
          chosenValue={x}
          setChosenValue={val => setLineState({ x: val })}
        />
        <CustomSelect
          multi
          title={'Y Keys'}
          data={numericColumns.filter(({ name, _ }) => name !== x)}
          chosenValue={y}
          setChosenValue={val => setLineState({ y: val })}
        />
        <CustomSelect
          title='Index by'
          data={stringColumns}
          chosenValue={indexBy}
          setChosenValue={val => setLineState({ indexBy: val })}
        />
      </>
      <IconButton
        size='small'
        onClick={reset}
      >
        <Clear />
      </IconButton>
    </div>
  )
}

ScatterControls.propTypes = {
  columns: PropTypes.array,
}
ScatterControls.default = {
  columns: [],
}

export default ScatterControls
