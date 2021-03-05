import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'

import { isJson, parseData, groupJson, getLayers, getChartData, sum } from './utils'


// const useStyles = makeStyles((theme) => ({
// }))

const useLineControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [data, setData] = useState(null)
  const [ready, setReady] = useState(true)
  const [area, setArea] = useState(false)
  const [groupedData, setGroupedData] = useState(null)
  const [options, setOptions] = useState([])
  const [chosenKey, setChosenKey] = useState([])
  const json = isJson(yAxis[0])

  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(results))
    if(xAxis && yAxis.length) {
      if (json) {
        setReady(false)
        setGroupedData(null)
        const [_options, _groupedData] = groupJson({
          results: resultsCopy ,
          groupKey: xAxis,
          key: yAxis[0]
        })
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
    }
  }, [area, chosenKey, json, results, xAxis, yAxis])

  useEffect(() => {
    if (xAxis && yAxis.length) {
      setChosenKey([]) // clear selected options on keys change
    }
  }, [xAxis, yAxis])

  useEffect(() => {
    const specs = {
      mode: 'lines+markers',
      type: 'scatter',
      ...(area && { fill: 'tonexty' })
    }
    if (json && groupedData) {
      const _res = parseData({ data: groupedData, keys: chosenKey })
      setData(_res.map(({ x, y, name }) => getLayers({
        x,
        y,
        name,
        specs
      })))
      setReady(true)
    }
    if (!json && groupedData) {
      setData(getChartData({
        sumData: groupedData,
        chosenKey,
      })({ specs }))
    }
  }, [json, groupedData, area, chosenKey])

  const props = {
    data,
    layout:{
      autosize: true,
      yaxis: {
        title: json ? yAxis[0] : 'value',
      },
      xaxis: {
        title: json || xAxis,
        ...((data && data[0].x.some((e) => e.length > 4) ) && { tickangle: 45, title: '' } )
      },
    },
    style: { width: '100%', height: '90%' },
  }

  const getLineControls = () => {
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
            onClick={() => setChosenKey([])}
          >
            <Clear />
          </IconButton>
        </>
        }
        <FormGroup style={{ padding: '30px 0 20px 0' }}>
          <FormControlLabel
            control={<Switch
              checked={area}
              onChange={({ target: { checked } }) => setArea(checked)}
              name='Area'
            />}
            label='Area'
          />
        </FormGroup>
      </>
    )
  }
  return [props, getLineControls, ready]
}

export default useLineControls
