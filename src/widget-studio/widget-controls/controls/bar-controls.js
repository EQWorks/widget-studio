import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../custom-select'

const useStyles = makeStyles({
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
})

const BarControls = ({ columns }) => {
  const classes = useStyles()

  const group = useStoreState((state) => state.bar.group)
  const stack = useStoreState((state) => state.bar.stack)
  const groupBy = useStoreState((state) => state.bar.groupBy)
  const keys = useStoreState((state) => state.bar.keys)
  const indexBy = useStoreState((state) => state.bar.indexBy)

  const setBarState = useStoreActions(actions => actions.bar.update)
  const reset = useStoreActions(actions => actions.resetCurrent)

  // TODO data inference rather than using 'category' attribute
  const [numericColumns, setNumericColumns] = useState([])
  const [stringColumns, setStringColumns] = useState([])
  useEffect(() => {
    setNumericColumns(columns.filter(({ _, category }) => category === 'Numeric'))
    setStringColumns(columns.filter(({ _, category }) => category === 'String'))
  }, [columns])

  const setGroup = event => {
    setBarState({ keys: [] })
    setBarState({ group: event.target.checked })
    setBarState({ groupBy: null })
  }

  return (
    <div className={classes.controls}>
      <FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={stack}
              onChange={event => setBarState({ stack: event.target.checked })}
              color="primary"
            />
          }
          label="Stacked"
        />
        <FormControlLabel
          control={
            <Switch
              checked={group}
              onChange={setGroup}
              color="primary"
            />
          }
          label="Group by key"
        />
      </FormControl>
      <CustomSelect
        multi={!group}
        title={group ? 'Key' : 'Keys'}
        data={numericColumns}
        chosenValue={group ? keys[0] : keys}
        setChosenValue={val => group ? setBarState({ keys: [val] }) : setBarState({ keys: val })}
      />
      <CustomSelect
        title='Index by'
        data={stringColumns}
        chosenValue={indexBy}
        setChosenValue={val => setBarState({ indexBy: val })}
      />
      {
        group &&
        <CustomSelect
          title='Group by'
          data={stringColumns}
          chosenValue={groupBy}
          setChosenValue={val => setBarState({ groupBy: val })}
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

BarControls.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
}
BarControls.default = {
  columns: [],
  rows: [],
}

export default BarControls
