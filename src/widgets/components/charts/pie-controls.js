import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'
import { getPieChartData, sum } from './utils'


// const useStyles = makeStyles((theme) => ({
// }))

const usePieControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
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
      hoverinfo: 'label+value+percent+name',
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
            // row: 0,
            column: i % 3 //3 charts per row
          }
          return chart
        })
      })

      const positionX = [0.12, 0.5, 0.87, 0.12, 0.5, 0.87]
      const positionY = [1.1, 1.1, 1.1, 2, 2, 2]
      const multiLayout = {
        grid: { rows: 1, columns: 3 },
        annotations:
          chosenKey.map((key, i) => ({
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
    const size = str.length
    return size > 12
      ? `${str.slice(0, 12)}<br />${str.slice(9)}`
      : str
  }


  const props = {
    data,
    layout: {
      autosize: true,
      ...multi,
    },
    style: { width: '100%', height: '90%' }
  }

  const getPieControls = () => {
    return (
      <>
        <div style={{ marginBottom: 20 }}>
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
        <FormGroup style={{ padding: '30px 0 20px 0' }}>
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
