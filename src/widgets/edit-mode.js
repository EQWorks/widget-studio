import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

// import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import {
  BarChart,
  LineChart,
  ScatterChart,
  PieChart,
} from '@eqworks/chart-system'
import { Typography, Switch, Button } from '@eqworks/lumen-ui'
import SelectColumns from './select-columns'
import CustomSelect from './custom-select'
import { downloadChart } from './helper'


// const useStyles = makeStyles((theme) => ({
// }))

const getChart = (type) => ({
  bar: BarChart,
  scatter: ScatterChart,
  pie: PieChart,
  line: LineChart,
  // map: 'map',
}[type])

const EditMode = ({ type, results, xAxis, setXAxis, yAxis, setYAxis, columns, grouped, setGrouped }) => {
  // const classes = useStyles()
  const chartRef = useRef(null)
  const [groupMode, setGroupMode] = useState('grouped')
  const [groupByKey, setGroupByKey] = useState('')
  const [layout, setLayout] = useState('vertical')
  const Chart = getChart(type)
  const isVertical = layout === 'vertical'
  const groupedProps = {
    groupByKey: groupByKey, //number of bars for each indexBy
    valueKey: yAxis[0],
    axisLeftLegendLabel: isVertical ? yAxis[0] : xAxis
  }
  const props = {
    keys: yAxis,
    axisLeftLegendLabel: '[tbd]', // fine tune option
  }

  return (
    <div style={{ display: 'flex' }}>
      <Paper ref={chartRef} style={{ height: 500, margin: '0 16px 16px 0', width: '75%' }}>
        <Button size='small' type='tertiary' onClick={() => downloadChart(chartRef)} > Download </Button>
        {(results.length && type) &&
           <Chart
             data={results} // has date?.convert to date object in barchart
             indexBy={xAxis}
             axisBottomLegendLabel={isVertical ? xAxis : yAxis}
             groupMode={groupMode} //when Y has more than one value
             layout={layout}
             {...(grouped ? groupedProps : props)}
           />
        }
      </Paper>
      <Paper style={{ width: '25%', marginBottom: 16, padding: 16 }}>
        <Typography> Control Panel</Typography>
        {/* Button to reopen modal and change chart type here */}
        <Typography>Data Key</Typography>
        <SelectColumns {...{ columnsData: columns, xAxis, setXAxis, yAxis, setYAxis }} />
        <div>
          <FormControl component='fieldset'>
            <RadioGroup aria-label='layout' name='layout1' value={layout} onChange={({ target: { value } }) => setLayout(value)}>
              <FormControlLabel value='vertical' control={<Radio />} label='Vertical' />
              <FormControlLabel value='horizontal' control={<Radio />} label='Horizontal' />
            </RadioGroup>
          </FormControl>
          <FormControl component='fieldset'>
            <RadioGroup aria-label='groupMode' name='group1' value={groupMode} onChange={({ target: { value } }) => setGroupMode(value)}>
              <FormControlLabel value='grouped' control={<Radio />} label='Grouped' />
              <FormControlLabel value='stacked' control={<Radio />} label='Stacked' />
            </RadioGroup>
          </FormControl>
        </div>
        <FormGroup>
          <FormControlLabel
            control={<Switch
              checked={grouped}
              onChange={({ target: { checked } }) => setGrouped(checked)}
              name='grouped'
            />}
            label='Group data'
          />
        </FormGroup>
        {grouped &&
        <>
          <CustomSelect
            title='Group By'
            data={columns}
            chosenValue={groupByKey}
            setChosenValue={setGroupByKey}
          />
        </>
        }
      </Paper>
    </div>
  )
}

EditMode.propTypes = {
  results: PropTypes.array,
  columns: PropTypes.array,
  type: PropTypes.string.isRequired,
  xAxis: PropTypes.string.isRequired,
  setXAxis: PropTypes.func.isRequired,
  yAxis: PropTypes.array.isRequired,
  setYAxis: PropTypes.func.isRequired,
  grouped: PropTypes.bool.isRequired,
  setGrouped: PropTypes.func.isRequired,
}
EditMode.default = {
  columns: [],
  results: [],
}

export default EditMode
