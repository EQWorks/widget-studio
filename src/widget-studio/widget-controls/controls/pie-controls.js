import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Switch from '@material-ui/core/Switch'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../custom-select'
// import { getPieChartData, sum } from './utils'
import styles from '../styles'

const useStyles = makeStyles(styles)

const PieControls = () => {
  const classes = useStyles()

  const columns = useStoreState((state) => state.bar.columns)
  const indexBy = useStoreState((state) => state.pie.indexBy)
  const keys = useStoreState((state) => state.pie.keys)
  const donut = useStoreState((state) => state.pie.donut)
  const setPieState = useStoreActions(actions => actions.pie.update)

  // const data = useStoreState((state) => state.data)
  // const groupedData = useStoreState((state) => state.groupedData)
  // const groupingOptions = useStoreState((state) => state.groupingOptions)
  // const multi = useStoreState((state) => state.pie.multi)
  // const capData = useStoreActions(actions => actions.pie.capData)

  // TODO data inference rather than using 'category' attribute
  const [numericColumns, setNumericColumns] = useState([])
  useEffect(() => {
    setNumericColumns(columns.filter(({ _, category }) => category === 'Numeric'))
  }, [columns])

  return (
    <>
      <div className={classes.controls}>
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={donut}
                onChange={({ target: { checked } }) => setPieState({ donut: checked })}
                color="primary"
              />
            }
            label='Donut'
          />
        </FormControl>
        <CustomSelect
          title='Index by'
          data={columns.filter(({ name, _ }) => !keys.includes(name))}
          chosenValue={indexBy}
          setChosenValue={val => setPieState({ indexBy: val })}
        />
        <CustomSelect
          multi
          title='Keys'
          data={numericColumns}
          chosenValue={keys}
          setChosenValue={val => setPieState({ keys: val })}
        />
        {/* {groupingOptions.length > 1 &&
        <>
          <CustomSelect
            multi
            title='Group By'
            data={groupingOptions.sort()}
            chosenValue={chosenKey}
            setChosenValue={handleDispatch({ key: 'chosenKey' })}
          />
          <IconButton
            size='small'
          onClick={() => handleDispatch({ chosenKey: keys.length > 1 ? [groupingOptions[0]] : [] })()}
          >
            <Clear />
          </IconButton>
        </>
      } */}
      </div>
    </>
  )
}

PieControls.propTypes = {
  columns: PropTypes.array,
}
PieControls.default = {
  columns: [],
}

export default PieControls
