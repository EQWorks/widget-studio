import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { useStoreState, useStoreActions } from 'easy-peasy'
import CustomSelect from '../custom-select'

const useStyles = makeStyles({
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
})

const LineControls = ({ columns }) => {
  const classes = useStyles()

  const indexByValue = useStoreState((state) => state.line.indexByValue)
  const stack = useStoreState((state) => state.line.stack)
  const groupBy = useStoreState((state) => state.line.groupBy)
  const x = useStoreState((state) => state.line.x)
  const y = useStoreState((state) => state.line.y)
  const keys = useStoreState((state) => state.line.keys)
  const indexBy = useStoreState((state) => state.line.indexBy)

  const setLineState = useStoreActions(actions => actions.line.update)
  const reset = useStoreActions(actions => actions.resetCurrent)

  // TODO data inference rather than using 'category' attribute
  const [numericColumns, setNumericColumns] = useState([])
  const [stringColumns, setStringColumns] = useState([])
  useEffect(() => {
    setNumericColumns(columns.filter(({ _, category }) => category === 'Numeric'))
    setStringColumns(columns.filter(({ _, category }) => category === 'String'))
  }, [columns])

  const setIndexByValue = event => {
    setLineState({ indexByValue: event.target.checked })
  }

  return (
    <div className={classes.controls}>
      <FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={indexByValue}
              onChange={setIndexByValue}
              color="primary"
            />
          }
          label="Index by value"
        />
      </FormControl>
      {
        indexByValue ?
          <>
            <CustomSelect
              // TODO multi optional
              multi
              title={'Y Keys'}
              data={numericColumns}
              chosenValue={y}
              setChosenValue={val => setLineState({ y: val })}
            />
            <CustomSelect
              title='Index by'
              data={stringColumns}
              chosenValue={indexBy}
              setChosenValue={val => setLineState({ indexBy: val })}
            />
            <CustomSelect
              title='X Key'
              data={stringColumns}
              chosenValue={x}
              setChosenValue={val => setLineState({ x: val })}
            />
          </>
          :
          <CustomSelect
            multi
            title={'Keys (min. 2)'}
            data={numericColumns}
            chosenValue={keys}
            setChosenValue={val => setLineState({ keys: val })}
          />

      }
      <IconButton
        size='small'
        onClick={reset}
      >
        <Clear />
      </IconButton>
    </div>
  )
}

LineControls.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
}
LineControls.default = {
  columns: [],
  rows: [],
}

export default LineControls
