import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { useStoreState, useStoreActions } from 'easy-peasy'
import CustomSelect from '../custom-select'
// import { parseData, groupJson, getChartData, getLayers, sum } from './utils'
import { groupJson, isJson, sum } from './utils'


const useStyles = makeStyles((theme) => ({
  row1: { marginBottom: theme.spacing(2.5) },
  row3: { padding: '30px 0 20px 0' },
}))

const BarControls = ({ columns, rows }) => {
  const classes = useStyles()
  const xAxis = useStoreState((state) => state.initState.xAxis)
  const yAxis = useStoreState((state) => state.initState.yAxis)

  // const data = useStoreState((state) => state.controllers.data)
  // const groupedData = useStoreState((state) => state.controllers.groupedData)
  const groupingOptions = useStoreState((state) => state.controllers.groupingOptions)
  const chosenKey = useStoreState((state) => state.controllers.chosenKey)
  const groupMode = useStoreState((state) => state.bar.groupMode)
  const layout = useStoreState((state) => state.bar.layout)
  // const isJson = useStoreState((state) => state.isJson)

  const handleDispatch = useStoreActions(actions => actions.handleDispatch)
  const setBarState = useStoreActions(actions => actions.bar.update)

  // const isVertical = layout === 'vertical'

  // compute options (grouping keys) on relevant changes
  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(rows))
    handleDispatch({
      groupingOptions:
        isJson(yAxis[0]) ?
          groupJson({ results: resultsCopy, groupKey: xAxis, key: yAxis[0] })[0]
          :
          Object.keys(sum({ results: resultsCopy, groupKey: xAxis, yKeys: yAxis }))
    })()
  }, [handleDispatch, rows, xAxis, yAxis])

  return (
    <>
      <div className={classes.row1}>
        <CustomSelect
          title='Column 1'
          data={columns}
          chosenValue={xAxis}
          setChosenValue={handleDispatch({ key: 'xAxis', type: 'WIDGETS' })}
        />
        <CustomSelect
          multi
          title='Columns 2'
          data={columns}
          chosenValue={yAxis}
          setChosenValue={handleDispatch({ key: 'yAxis', type: 'WIDGETS' })}
        />
      </div>
      {groupingOptions.length > 1 &&
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
            onClick={() => handleDispatch({ chosenKey: [] })()}
          >
            <Clear />
          </IconButton>
        </>
      }
      <div className={classes.row3}>
        <FormControl component='fieldset'>
          <RadioGroup aria-label='layout' name='layout1' value={layout} onChange={({ target: { value } }) => setBarState({ layout: value })}>
            <FormControlLabel value='vertical' control={<Radio />} label='Vertical' />
            <FormControlLabel value='horizontal' control={<Radio />} label='Horizontal' />
          </RadioGroup>
        </FormControl>
      </div>

      {(yAxis.length > 1 || groupingOptions.length > 1) &&
        <FormControl component='fieldset'>
          <RadioGroup aria-label='groupMode' name='group1' value={groupMode} onChange={({ target: { value } }) => setBarState({ groupMode: value })}>
            <FormControlLabel value='group' control={<Radio />} label='Grouped' />
            <FormControlLabel value='stack' control={<Radio />} label='Stacked' />
          </RadioGroup>
        </FormControl>}
    </>
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
