import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import CustomSelect from '../custom-select'
import { isJson, parseData, groupJson, getChartData, getLayers, sum } from './utils'


const useStyles = makeStyles((theme) => ({
  row1: { marginBottom: theme.spacing(2.5) },
  row3: { padding: '30px 0 20px 0' },
}))

const useBarControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const classes = useStyles()
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
    setGroupedData(null)
    if (json) {
      setReady(false)
      setGroupedData(null)
      const [_options, _groupedData] = groupJson({ results: resultsCopy, groupKey: xAxis, key: yAxis[0] })
      setOptions(_options)
      setGroupedData(_groupedData)
    } else {
      const _groupedData = sum({
        results: resultsCopy,
        groupKey: xAxis,
        yKeys: yAxis,
      })
      setOptions(Object.keys(_groupedData))
      setGroupedData(_groupedData)
    }
  }, [isVertical, json, results, xAxis, yAxis])

  useEffect(() => {
    if (xAxis && yAxis.length) {
      setChosenKey([]) // clear selected options on keys change
    }
  }, [xAxis, yAxis])

  useEffect(() => {
    const specs = {
      type: 'bar',
      orientation: isVertical ? 'v' : 'h',
      hovertemplate: '<b> %{fullData.name} </b>' +
      // '<br> %{x}: %{y} ' +
      '<br><b> %{xaxis.title.text}</b>: %{x} ' +
      '<br><b> %{yaxis.title.text}</b>: %{y} <br>' +
      '<extra></extra>',
      isVertical,
    }
    if (json && groupedData) {
      const _res = parseData({ data: groupedData, keys: chosenKey })
      setData(_res.map(({ x, y, name }) => getLayers({
        x,
        y,
        name,
        specs,
      })))
      setReady(true)
    }
    if (!json && groupedData) {
      setData(getChartData({
        sumData: groupedData,
        chosenKey,
      })({ specs }))
    }
  }, [chosenKey, groupedData, isVertical, json])

  const islongTickLabel = (axis) => {
    if (data && data[0]) {
      return data[0][axis].some((e) => e.length > 4)
    } else {
      return false
    }
  }

  const getTitle = (axis) => ({
    x: isVertical ? json || xAxis : 'value',
    y: isVertical ? 'value' : json || xAxis
  }[axis])

  const props = {
    data,
    layout:{
      autosize: true,
      hovermode: 'closest',
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      yaxis: {
        // visible: !islongTickLabel('y'),
        title: {
          text: getTitle('y'),
          standoff: isVertical ? 5 : 20
        },
        automargin: true,
        ticklen: 8,
        showline: true,
      },
      xaxis: {
        // visible: !islongTickLabel('x'),
        title: {
          text: getTitle('x'),
          standoff: isVertical ? 5 : 20
        },
        automargin: true,
        tickangle: islongTickLabel('x') ? 45 : 0,
        ticklen: 8,
      },
      ...( data?.length > 1 ? { barmode: groupMode } : {}),
    },
    useResizeHandler: true,
  }

  const getBarControls = () => {
    return (
      <>
        <div className={classes.row1}>
          <CustomSelect
            title='Key X'
            data={columns}
            chosenValue={xAxis}
            setChosenValue={setXAxis}
          />
          <CustomSelect
            multi
            title='Keys Y'
            data={columns}
            chosenValue={yAxis}
            setChosenValue={setYAxis}
          />
        </div>
        {options.length > 1 &&
          <>
            <CustomSelect
              multi
              title='Group By'
              data={options.sort()}
              chosenValue={chosenKey}
              setChosenValue={setChosenKey}
            />
            <IconButton
              size='small'
              onClick={() => setChosenKey([])}
            >
              <Clear />
            </IconButton>
          </>
        }
        <div className={classes.row3}>
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
