import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { Typography } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'
import { isJson, parseBar, groupJson, parseLine } from './utils'


// const useStyles = makeStyles((theme) => ({
// }))

const useBarControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [groupMode, setGroupMode] = useState('group')
  // const [grouped, setGrouped] = useState(false)
  // const [groupByKey, setGroupByKey] = useState('')
  const [layout, setLayout] = useState('vertical')
  const [res, setRes] = useState(null)
  const [options, setOptions] = useState(null)
  const [chosenKey, setChosenKey] = useState('')
  const [jsonGroupedData, setJsonGroupedData] = useState(null)
  const [ready, setReady] = useState(false)
  const json = isJson(yAxis[0])

  useEffect(() => {
    if (json) {
      setReady(false)
      setJsonGroupedData(null)
      const [_options, _groupedData] = groupJson({ results, groupKey: xAxis, key: yAxis[0] })
      setOptions(_options)
      !_options.includes(chosenKey) && setChosenKey('')
      setJsonGroupedData(_groupedData)
      setRes(parseLine({ data: _groupedData, type: json }))
      setReady(true)
    } else {
      setRes(null)
      setOptions(null)
      setReady(true)
      setChosenKey('')
    }
  }, [chosenKey, json, results, xAxis, yAxis])

  useEffect(() => {
    if (chosenKey) {
      const finalRes = parseBar({ data: jsonGroupedData, key: chosenKey, type: json })
      setRes(finalRes)
      setReady(true)
    }
  }, [chosenKey, json, jsonGroupedData])

  const isVertical = layout === 'vertical'

  const x = res?.map((e) => e[json])
  const y = res?.map(({ visits }) => visits)

  const generateLayers = (xkey, ykey) => {
    const x = []
    const _y = {}
    results.forEach((e) => {
      x.push(e[xkey])
      ykey.forEach((key) => {
        _y[key]
          ? _y[key].push(e[key])
          : _y[key] = [e[key]]
      })
    })
    const generateChartProps = (x, y, name) => ({
      type: 'bar',
      x: isVertical ? x : y,
      y: isVertical ? y : x,
      orientation: isVertical ? 'v' : 'h',
      name,
      showlegend: true,
      hoverinfo: 'skip'
    })

    const data = []
    const layers = Object.entries(_y)
    for (let [name, ydata] of layers) {
      data.push(generateChartProps(x, ydata, name))
    }
    return data
  }

  const data = json
    ? [{
      type: 'bar',
      x: isVertical ? x : y,
      y: isVertical ? y : x,
      orientation: isVertical ? 'v' : 'h',
      name: yAxis[0],
      showlegend: true,
      hoverinfo: 'skip'
    }]
    : generateLayers(xAxis, yAxis)
  const props = {
    data,
    layout:{
      yaxis: {
        title: isVertical ? 'value' : json || xAxis,
      },
      xaxis: {
        title: isVertical ? json || xAxis : 'value',
      },
      ...( data.length > 1 ? { barmode: groupMode } : {}),
    },
    style: { width: '100%', height: '90%' },
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
        {options &&
          <CustomSelect
            title='Group By'
            data={['All', ...options]}
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

        <FormControl component='fieldset'>
          <RadioGroup aria-label='groupMode' name='group1' value={groupMode} onChange={({ target: { value } }) => setGroupMode(value)}>
            <FormControlLabel value='group' control={<Radio />} label='Grouped' />
            <FormControlLabel value='stack' control={<Radio />} label='Stacked' />
          </RadioGroup>
        </FormControl>
        {/* {!json &&
        <>
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
        } */}
      </>
    )
  }
  return [props, getBarControls, ready]
}

export default useBarControls
