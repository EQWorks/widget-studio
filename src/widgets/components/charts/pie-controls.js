import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'
import { getChartData, getLayers, sum } from './utils'


// const useStyles = makeStyles((theme) => ({
// }))

const usePieControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [isDonut, setIsDonut] = useState(false)
  const [groupedData, setGroupedData] = useState(null)
  const [data, setData] = useState(null)

  const [options, setOptions] = useState(null)
  const [chosenKey, setChosenKey] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (yAxis[1]) {
      const resultsCopy = JSON.parse(JSON.stringify(results))
      setReady(false)
      setChosenKey('')
      const _groupedData = sum({
        results: resultsCopy,
        groupKey: xAxis,
        yKeys: yAxis,
      })
      setOptions(Object.keys(_groupedData))
      setGroupedData(_groupedData)
    } else {
      setGroupedData(null)
      setOptions('')
      setChosenKey('')
      setReady(true)
    }
  }, [results, xAxis, yAxis])

  useEffect(() => {
    if (options) {
      setChosenKey(options[0])
      setReady(true)
    }
  }, [options])

  useEffect(() => {
    let values
    let labels
    if (chosenKey) {
      values = Object.values(groupedData[chosenKey])
      labels = Object.keys(groupedData[chosenKey])
    } else {
      values = results.map((e) => e[yAxis[0]])
      labels = results.map((e) => e[xAxis])
    }
    const specs = {
      type: 'pie',
      values,
      labels,
      textposition: 'inside',
      hoverinfo: 'label+value+percent+name',
      ...(isDonut? { hole: .5 } : {})
    }
    setData([getLayers({ name: chosenKey, specs })])
  }, [chosenKey, groupedData, isDonut, options, results, xAxis, yAxis])

  // const handleText = (str) => {
  //   const size = str.length
  //   return size > 12
  //     ? `${str.slice(0, 12)}<br />${str.slice(9)}`
  //     : str
  // }


  // const _options = options?.slice(0,3)
  // const _data = []
  // if (options && !chosenKey) {
  //   _options.forEach((option, i) => {
  //     _data.push({
  //       type: 'pie',
  //       domain: {
  //         row: Math.ceil((i + 1) / 3),
  //         column: i % 3 //3 charts per row
  //       },
  //       name: option,
  //       hoverinfo: 'label+value+percent+name',
  //       // textinfo: 'none',
  //       textposition: 'inside',
  //       values: r[option].map(({ value }) => value),
  //       labels: r[option].map(({ id }) => id),
  //       ...(isDonut? { hole: .5 } : {})
  //     })
  //   })
  // }
  // const positionX = [0.12, 0.5, 0.87, 0.12, 0.5, 0.87]
  // const positionY = [1.1, 1.1, 1.1, 2, 2, 2]
  const props = {
    data,
    layout: {
      autosize: true,
      // grid: { rows: Math.ceil(_options.length / 3), columns: 3 },
      // annotations:
      //   _options.map((option, i) => ({
      //     font: { size: 15 },
      //     text: handleText(option),
      //     showarrow: false,
      //     x: positionX[i],
      //     y: positionY[i],
      //   }))
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
        {options &&
          <CustomSelect
            title='Group By'
            data={['All', ...options]}
            chosenValue={chosenKey}
            setChosenValue={setChosenKey}
          />
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
