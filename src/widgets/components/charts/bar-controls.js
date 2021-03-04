import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { Typography } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'
import { isJson, parseBar, groupJson, getChartData, getLayers } from './utils'


// const useStyles = makeStyles((theme) => ({
// }))

const useBarControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [groupMode, setGroupMode] = useState('group')
  const [layout, setLayout] = useState('vertical')
  const [groupedData, setGroupedData] = useState(null)
  const [data, setData] = useState(null)
  const [options, setOptions] = useState([])
  const [chosenKey, setChosenKey] = useState([])
  const [ready, setReady] = useState(true)
  const json = isJson(yAxis[0])
  const isVertical = layout === 'vertical'

  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(results))
    if (json) {
      setReady(false)
      setGroupedData(null)
      const [_options, _groupedData] = groupJson({ results: resultsCopy, groupKey: xAxis, key: yAxis[0] })
      setOptions(_options)
      setGroupedData(_groupedData)
    } else {
      setData(getChartData(resultsCopy, xAxis, yAxis, isVertical))
    }
  }, [isVertical, json, results, xAxis, yAxis])

  useEffect(() => {
    if (xAxis && yAxis.length) {
      setChosenKey([]) // clear selected options on keys change
    }
  }, [xAxis, yAxis])

  useEffect(() => {
    if (json && groupedData) {
      const _res = parseBar({ data: groupedData, keys: chosenKey })
      setData(_res.map(({ x, y, name }) => getLayers({ x, y, name, isVertical })))
      setReady(true)
    }
  }, [chosenKey, groupedData, isVertical, json])

  const props = {
    data,
    layout:{
      autosize: true,
      yaxis: {
        title: isVertical ? 'value' : json || xAxis,
      },
      xaxis: {
        title: isVertical ? json || xAxis : 'value',
      },
      ...( data?.length > 1 ? { barmode: groupMode } : {}),
    },
    style: { width: '100%', height: '90%' },
    useResizeHandler: true
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
        {options.length > 1 &&
          <CustomSelect
            multi
            title='Group By'
            data={options}
            chosenValue={chosenKey}
            setChosenValue={setChosenKey}
          />
        }
        <div>
          <FormControl component='fieldset'>
            <RadioGroup aria-label='layout' name='layout1' value={layout} onChange={({ target: { value } }) => setLayout(value)}>
              <FormControlLabel value='vertical' control={<Radio />} label='Vertical' />
              <FormControlLabel value='horizontal' control={<Radio />} label='Horizontal' />
            </RadioGroup>
          </FormControl>
        </div>

        {(yAxis.length > 1 || options.length > 1) &&
        <FormControl component='fieldset'>
          <RadioGroup aria-label='groupMode' name='group1' value={groupMode} onChange={({ target: { value } }) => setGroupMode(value)}>
            <FormControlLabel value='group' control={<Radio />} label='Grouped' />
            <FormControlLabel value='stack' control={<Radio />} label='Stacked' />
          </RadioGroup>
        </FormControl>}
      </>
    )
  }
  return [props, getBarControls, ready]
}

export default useBarControls
