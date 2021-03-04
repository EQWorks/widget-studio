import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'
import { isJson, parseData, groupJson, getLayers, getChartData } from './utils'


// const useStyles = makeStyles((theme) => ({
// }))

const useLineControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [data, setData] = useState(null)
  const [ready, setReady] = useState(true)
  const [area, setArea] = useState(false)
  const [groupedData, setGroupedData] = useState(null)
  const json = isJson(yAxis[0])

  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(results))
    if (json) {
      setReady(false)
      setGroupedData(null)
      const [, _groupedData] = groupJson({
        results: resultsCopy ,
        groupKey: xAxis,
        key: yAxis[0]
      })
      setGroupedData(_groupedData)
    } else {
      setData(getChartData({
        results: resultsCopy,
        groupKey: xAxis,
        yKeys: yAxis,
        type: 'scatter',
        area,
      }))
    }
  }, [area, json, results, xAxis, yAxis])

  useEffect(() => {
    if (json && groupedData) {
      const _res = parseData({ data: groupedData, keys: [] })
      setData(_res.map(({ x, y, name }) => getLayers({
        x,
        y,
        name,
        type: 'scatter',
        area,
      })))
      setReady(true)
    }
  }, [json, groupedData, area])

  const props = {
    data,
    layout:{
      autosize: true,
      yaxis: {
        title: json ? yAxis[0] : 'value',
      },
      xaxis: {
        title: json || xAxis,
      },
    },
    style: { width: '100%', height: '90%' },
  }

  const getLineControls = () => {
    return (
      <>
        {/* <Typography>Data Key</Typography> */}
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
        {/* {options &&
          <CustomSelect
            title='Group By'
            data={options}
            chosenValue={chosenKey}
            setChosenValue={setChosenKey}
          />
        } */}
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
