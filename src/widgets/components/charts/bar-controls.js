import React, { useState } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { Typography, Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../../custom-select'

// const useStyles = makeStyles((theme) => ({
// }))

const useBarControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [groupMode, setGroupMode] = useState('grouped')
  const [grouped, setGrouped] = useState(false)
  const [groupByKey, setGroupByKey] = useState('')
  const [layout, setLayout] = useState('vertical')

  const isVertical = layout === 'vertical'
  // if bar chart is grouped, props will be different
  const groupedProps = {
    groupByKey: groupByKey, //number of bars for each indexBy
    valueKey: yAxis[0],
    axisLeftLegendLabel: isVertical ? yAxis[0] : xAxis
  }
  const _props = {
    keys: yAxis,
    axisLeftLegendLabel: 'value', // TODO fine tune option
  }

  const props = {
    indexBy: xAxis,
    axisBottomLegendLabel: isVertical ? xAxis : yAxis,
    groupMode: groupMode, //when Y has more than one value
    layout: layout,
    ...(grouped ? groupedProps : _props)
  }
  const getBarControls = () => {
    return (
      <>
        <Typography>Data Key</Typography>
        <CustomSelect
          title='Axis X'
          data={columns}
          chosenValue={xAxis}
          setChosenValue={setXAxis}
        />
        <CustomSelect
          multi
          title='Axis Y'
          data={columns}
          chosenValue={yAxis}
          setChosenValue={setYAxis}
        />
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
          <Typography variant='caption'>(only first key will be used in Y Axis)</Typography>
          <CustomSelect
            title='Group By Key'
            data={columns}
            chosenValue={groupByKey}
            setChosenValue={setGroupByKey}
          />
        </>
        }
      </>
    )
  }
  return [props, getBarControls]
}

export default useBarControls
