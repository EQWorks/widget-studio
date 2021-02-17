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
      setReady(false)
      setChosenKey('')
      const res = results.reduce((agg, element) => {
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

  const props = {
    ...(chosenKey
      ? { data: r[chosenKey] }
      : { indexBy: xAxis, dataKey: yAxis[0] }),
    isDonut: isDonut,
    // TODO learn more about other props and data grouping including tooltips
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
            data={options}
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
