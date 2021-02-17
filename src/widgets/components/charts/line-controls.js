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
      setRes(Object.values(finalRes))
      setReady(true)
    }
  }, [json, results, xAxis, yAxis])

  const props = {
    ...( json &&
       {
         data: res,
         indexBy: 'name',
         xKey: json,
         yKeys: ['visits'],
         axisBottomLegendLabel: json,
         axisLeftLegendLabel: yAxis[0],
       }),
    ...(!isDataSerie &&
          {
            data: res,
            xKey: xAxis,
            yKeys: yAxis,
            axisBottomLegendLabel: xAxis,
            axisLeftLegendLabel: 'value',
          }),

    enableArea: area,
    indexByValue: isDataSerie,
    xScale: { type: 'point' },
    // pointSize: 6,
    // pointBorderWidth: 2
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
