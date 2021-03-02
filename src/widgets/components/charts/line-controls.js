import React, { useState, useEffect } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import { Typography, Switch } from '@eqworks/lumen-ui'
import CustomSelect from '../custom-select'
import { isJson, parseLine, groupJson } from './utils'


// const useStyles = makeStyles((theme) => ({
// }))

const useLineControls = ({ columns, xAxis: _xAxis, yAxis: _yAxis, results }) => {
  const [xAxis, setXAxis] = useState(_xAxis)
  const [yAxis, setYAxis] = useState([_yAxis])
  const [isDataSerie, setIsDataSerie] = useState(true)
  const [res, setRes] = useState(null)
  const [ready, setReady] = useState(false)
  const [area, setArea] = useState(false)
  const [jsonGroupedData, setJsonGroupedData] = useState(null)
  const json = isJson(yAxis[0])

  useEffect(() => {
    if (json) {
      setReady(false)
      setJsonGroupedData(null)
      setIsDataSerie(true)
      const [, _groupedData] = groupJson({ results, groupKey: xAxis, key: yAxis[0] })
      setJsonGroupedData(_groupedData)
    }
    //  else {
    // setReady(true)
    // setRes(null)
    // }
  }, [json, results, xAxis, yAxis])

  useEffect(() => {
    if (jsonGroupedData) {
      const finalRes = parseLine({ data: jsonGroupedData, type: json })
      setRes(finalRes)
      setReady(true)
    }
  }, [json, jsonGroupedData])

  useEffect(() => {
    if (!json && yAxis.length) {
      setReady(false)
      setIsDataSerie(false)
      const finalRes = results.reduce((agg, element) => {
        const id = element[xAxis]
        if (!agg[id]) {
          agg[id] = { [xAxis]: id }
          yAxis.forEach((key) => {
            agg[id][key] = element[key]
          })
        } else {
          yAxis.forEach((key) => {
            agg[id][key] = agg[id][key] + element[key]
          })
        }
        return agg
      }, {})
      // console.log(finalRes)
      // {
      //   "QC": {
      //     "address_region": "QC", // xaxis
      //     "converted_visits": 3208 //yaxis
      //   },
      //   "BC": {
      //     "address_region": "BC", // xaxis
      //     "converted_visits": 3208 //yaxis
      //   }
      // }
      setRes(Object.values(finalRes))
      setReady(true)
    }
  }, [json, results, xAxis, yAxis])

  const x = res?.map((e) => e[json])
  const y = res?.map(({ visits }) => visits)

  const generateLayers = (xkey, ykeys) => {
    const x = []
    const _y = {}
    Object.values(res).forEach((e) => {
      x.push(e[xkey])
      ykeys.forEach((key) => {
        _y[key]
          ? _y[key].push(e[key])
          : _y[key] = [e[key]]
      })
    })
    const generateChartProps = (x, y, name) => ({
      type: 'scatter',
      x,
      y,
      name,
      showlegend: true,
      ...(area && { fill: 'tonexty' })
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
      type: 'scatter',
      x,
      y,
      mode: 'lines+markers',
      name: yAxis[0],
      showlegend: true,
      ...(area && { fill: 'tonexty' })
    }]
    : res && generateLayers(xAxis, yAxis)
  const props = {
    data,
    layout:{
      yaxis: {
        title: 'value',
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
        {/* {options &&
          <CustomSelect
            title='Group By'
            data={options}
            chosenValue={chosenKey}
            setChosenValue={setChosenKey}
          />
        } */}
        <FormGroup>
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
