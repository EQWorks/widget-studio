import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { Typography, Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'

// const useStyles = makeStyles((theme) => ({
// }))

const usePieControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [isDonut, setIsDonut] = useState(false)
  const [r, setR] = useState(null)

  const [options, setOptions] = useState(null)
  const [chosenKey, setChosenKey] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (yAxis[1]) {
      const resultsCopy = JSON.parse(JSON.stringify(results))
      setReady(false)
      setChosenKey('')
      const res = resultsCopy.reduce((agg, element) => {
        const _groupKey = element[xAxis]
        const value = yAxis.map((key) => ({ id: key, value: element[key] }))
        if (agg[_groupKey]) {
          agg[_groupKey] = [...agg[_groupKey], ...value]
        } else {
          agg[_groupKey] = value
        }
        return agg
      }, {})
      /**res:
       * [{id: yAxis[0], value: 10 }, {id: yAxis[1], value:5 }, {id: yAxis[2], value: 14 }...]
       */
      setOptions(Object.keys(res))
      setR(res)
    } else {
      setR(null)
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


  const data = [{
    type: 'pie',
    values: chosenKey
      ? r[chosenKey].map(({ value }) => value)
      : results.map((e) => e[yAxis[0]]),
    labels: chosenKey
      ? r[chosenKey].map(({ id }) => id)
      : results.map((e) => e[xAxis]),
    ...(isDonut? { hole: .5 } : {})
  }]

  const _options = options?.slice(0,3)
  const _data = []
  if (options && !chosenKey) {
    _options.forEach((option, i) => {
      _data.push({
        type: 'pie',
        domain: {
          row: Math.ceil((i + 1) / 3),
          column: i % 3 //3 charts per row
        },
        name: option,
        hoverinfo: 'label+value+percent+name',
        textinfo: 'none',
        values: r[option].map(({ value }) => value),
        labels: r[option].map(({ id }) => id),
        ...(isDonut? { hole: .5 } : {})
      })
    })
  }
  const positionX = [0.12, 0.5, 0.87, 0.12, 0.5, 0.87]
  const positionY = [0.5, 0.5, 0.5, 2, 2, 2]
  const props = {
    data: _data.length ? _data : data,
    ...(_data.length
      ? {
        layout: {
          autosize: true,
          grid: { rows: Math.ceil(_options.length / 3), columns: 3 },
          annotations:
            _options.map((option, i) => ({
              font: { size: 15 },
              text: option,
              showarrow: false,
              x: positionX[i],
              y: positionY[i],
            }))
        }
      }
      : {}
    ),
    style: { width: '100%', height: '90%' }
  }

  const getPieControls = () => {
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
        <FormGroup>
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
