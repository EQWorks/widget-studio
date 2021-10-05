import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../custom-select'
import styles from '../styles'

const useStyles = makeStyles(styles)

const LineControls = () => {
  const classes = useStyles()

  const columns = useStoreState((state) => state.columns)
  const indexByValue = useStoreState((state) => state.line.indexByValue)
  const x = useStoreState((state) => state.line.x)
  const y = useStoreState((state) => state.line.y)
  const indexBy = useStoreState((state) => state.line.indexBy)

  const setLineState = useStoreActions(actions => actions.line.update)

  // TODO data inference rather than using 'category' attribute
  const [numericColumns, setNumericColumns] = useState([])
  const [stringColumns, setStringColumns] = useState([])
  useEffect(() => {
    setNumericColumns(columns.filter(({ category }) => category === 'Numeric'))
    setStringColumns(columns.filter(({ category }) => category === 'String'))
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
      <CustomSelect
        title='X Key'
        data={columns}
        chosenValue={x}
        setChosenValue={val => setLineState({ x: val })}
      />
      <CustomSelect
        // TODO multi optional
        multi
        title={'Y Keys'}
        data={numericColumns}
        chosenValue={y}
        setChosenValue={val => setLineState({ y: val })}
      />
      {
        indexByValue &&
        <CustomSelect
          title='Index by'
          data={columns}
          chosenValue={indexBy}
          setChosenValue={val => setLineState({ indexBy: val })}
        />
      }

    </div>
  )
}

LineControls.propTypes = {
  columns: PropTypes.array,
}
LineControls.default = {
  columns: [],
}

export default LineControls
