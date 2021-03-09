import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'
import { getPieChartData, sum } from './utils'


const useStyles = makeStyles((theme) => ({
  row1: { marginBottom: theme.spacing(2.5) },
  row3: { padding: '30px 0 20px 0' },
}))

const usePieControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const classes = useStyles()
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [isDonut, setIsDonut] = useState(false)
  const [groupedData, setGroupedData] = useState(null)
  const [data, setData] = useState(null)
  const [multi, setMulti] = useState({})
  const [options, setOptions] = useState([])
  const [chosenKey, setChosenKey] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(results))
    setReady(false)
    setChosenKey([])
    const _groupedData = sum({
      results: resultsCopy,
      groupKey: xAxis,
      yKeys: yAxis,
    })
    setOptions(Object.keys(_groupedData))
    setGroupedData(_groupedData)
  }, [results, xAxis, yAxis])

  useEffect(() => {
    if (options.length) {
      if (yAxis.length > 1) {
        setChosenKey([options[0]])
      } else {
        setChosenKey([])
      }
    }
  }, [options, yAxis])

  useEffect(() => {
    let values
    let labels
    const specs = {
      type: 'pie',
      values,
      labels,
      textposition: 'inside',
      hovertemplate:'<b>%{fullData.name}</b>' +
      '<br><b>%{label}</b>: %{value} ' +
      '<br><b>percent</b>: %{percent} ' +
      '<extra></extra>',
      ...(isDonut? { hole: .5 } : {})
    }
    if (groupedData) {
      setData(getPieChartData({ sumData: groupedData, chosenKey, yKeys: yAxis })({ specs }))
    }
    setReady(true)
  }, [chosenKey, groupedData, isDonut, options, results, xAxis, yAxis])

  useEffect(() => {
    // creates grid
    if (chosenKey.length > 1 && yAxis.length > 1) {
      setData((prevData) => {
        return prevData.slice(0, 3).map((chart, i) => {
          chart.domain =  {
            column: i % 3 //3 charts per row
          }
          return chart
        })
      })

      const positionX = [0.1, 0.5, 0.9, 0.12, 0.5, 0.87]
      const positionY = [1.2, 1.2, 1.2, 2, 2, 2] // upper
      const multiLayout = {
        grid: { rows: 1, columns: 3 },
        annotations:
          chosenKey.slice(0, 3).map((key, i) => ({
            font: { size: 15 },
            text: handleText(key),
            showarrow: false,
            x: positionX[i],
            y: positionY[i],
          }))
      }
      setMulti(multiLayout)
    } else {
      setMulti({})
    }
  }, [chosenKey, yAxis, isDonut])

  const handleText = (str) => {
    // const size = str.length
    //   ? `${_str.slice(0, 12)}<br />${_str.slice(12)}`
    // return size > 12
    //   : _str
    const _str = str.replace(/[^A-Za-zÀ-ÿ &]+/g, '')
      .trim()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
    return _str
  }


  const props = {
    data,
    layout: {
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      autosize: true,
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      ...multi,
    },
  }

  const getPieControls = () => {
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
            onClick={() => setChosenKey(yAxis.length > 1 ? [options[0]] : [])}
          >
            <Clear />
          </IconButton>
        </>
        }
        <FormGroup className={classes.row3}>
          <FormControlLabel
            control={<Switch
              checked={isDonut}
              onChange={({ target: { checked } }) => setIsDonut(checked)}
              name='style'
            />}
            label='Donut'
          />
        </FormGroup>
      </>
    )
  }
  return [props, getPieControls, ready]
}

export default usePieControls
