import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { Switch } from '@eqworks/lumen-ui'
import { useStoreState } from 'easy-peasy'
import CustomSelect from '../custom-select'

import { isJson, parseData, groupJson, getLayers, getChartData, sum } from './utils'


const useStyles = makeStyles((theme) => ({
  row1: { marginBottom: theme.spacing(2.5) },
  row3: { padding: '30px 0 20px 0' },
}))

const useLineControls = ({ columns, results }) => {
  const classes = useStyles()
  const xAxis = useStoreState((state) => state.widgets.initState.xAxis)
  const yAxis = useStoreState((state) => state.widgets.initState.yAxis)
  const [data, setData] = useState(null)
  const [ready, setReady] = useState(true)
  const [area, setArea] = useState(false)
  const [multiAxis, setMultiAxis] = useState(false)
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
      type: 'scatter',
      mode: 'lines+markers', // makes axis start far from 0
      hovertemplate: '<b> %{fullData.name} </b>' +
      // '<br> %{x}: %{y} ' +
      '<br><b> %{xaxis.title.text}</b>: %{x} ' +
      '<br><b> %{yaxis.title.text}</b>: %{y} <br>' +
      '<extra></extra>',
      connectgaps: true,
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
      const _data = getChartData({
        sumData: groupedData,
        chosenKey,
      })({ specs })
      if (multiAxis) {
        setData(_data
          .slice(0, 2)
          .map((d, i) => {
            let _data = d
            if (i === 1) {
              _data = { ...d, yaxis: 'y2' }
            }
            return _data
          })
        )
      } else {
        setData(_data)
      }
    }
  }, [json, groupedData, area, chosenKey, multiAxis])

  const islongTickLabel = data && data[0].x.some((e) => e.length > 4)
  const props = {
    data,
    layout:{
      showlegend: multiAxis ? false : true,
      autosize: true,
      hovermode: 'closest',
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      yaxis: {
        title: {
          text: json || multiAxis ? yAxis[0] : 'value',
          standoff: 20,
        },
        automargin: true,
        showline: true,
      },
      xaxis: {
        title: {
          text: json || xAxis,
          standoff: 20
        },
        automargin: true,
        tickangle: islongTickLabel ? 45 : 0,
        rangemode: 'tozero'
      },
      ...(multiAxis && { yaxis2: {
        overlaying: 'y',
        side: 'right',
        title: yAxis[1],
        automargin: true,
        type: 'linear',
        showline: true,
      } })
    },
  }
  const getLineControls = () => {
    return (
      <>
        <div className={classes.row1}>
          <CustomSelect
            title='Key X'
            data={columns}
            chosenValue={xAxis}
            setChosenValue='xAxis'
          />
          <CustomSelect
            multi
            title='Keys Y'
            data={columns}
            chosenValue={yAxis}
            setChosenValue='yAxis'
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
        <FormGroup className={classes.row3}>
          <FormControlLabel
            style={{ marginBottom: 20 }}
            control={<Switch
              checked={area}
              onChange={({ target: { checked } }) => setArea(checked)}
              name='Area'
            />}
            label='Area'
          />
          {(!json && yAxis.length > 1) &&
          <FormControlLabel
            control={<Switch
              checked={multiAxis}
              onChange={({ target: { checked } }) => setMultiAxis(checked)}
              name='Multi Axis'
            />}
            label='Multi Axis'
          />
          }
        </FormGroup>
      </>
    )
  }
  return [props, getLineControls, ready]
}

export default useLineControls
