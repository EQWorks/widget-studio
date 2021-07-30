import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { Switch } from '@eqworks/lumen-ui'
import { useStoreState, useStoreActions } from 'easy-peasy'
import CustomSelect from '../custom-select'

import { parseData, groupJson, getLayers, getChartData, sum } from './utils'


const useStyles = makeStyles((theme) => ({
  row1: { marginBottom: theme.spacing(2.5) },
  row3: { padding: '30px 0 20px 0' },
}))

const LineControls = ({ columns, rows }) => {
  const classes = useStyles()
  const xAxis = useStoreState((state) => state.initState.xAxis)
  const yAxis = useStoreState((state) => state.initState.yAxis)

  const data = useStoreState((state) => state.controllers.data)
  const groupedData = useStoreState((state) => state.controllers.groupedData)
  const groupingOptions = useStoreState((state) => state.controllers.groupingOptions)
  const chosenKey = useStoreState((state) => state.controllers.chosenKey)
  const area = useStoreState((state) => state.line.area)
  const multiAxis = useStoreState((state) => state.line.multiAxis)
  const isJson = useStoreState((state) => state.isJson)

  const handleDispatch = useStoreActions(actions => actions.handleDispatch)
  const setLineState = useStoreActions(actions => actions.line.update)

  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(rows))
    if (xAxis && yAxis.length) {
      if (isJson) {
        handleDispatch({ ready: false })()
        // setGroupedData(null)
        const [_groupingOptions, _groupedData] = groupJson({
          results: resultsCopy,
          groupKey: xAxis,
          key: yAxis[0]
        })
        handleDispatch({
          groupingOptions: _groupingOptions,
          groupedData: _groupedData,
        })()
      } else {
        const _groupedData = sum({
          results: resultsCopy,
          groupKey: xAxis,
          yKeys: yAxis,
        })
        handleDispatch({
          groupingOptions: Object.keys(_groupedData),
          groupedData: _groupedData,
        })()
      }
    }
  }, [area, chosenKey, handleDispatch, isJson, rows, xAxis, yAxis])

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
    if (isJson && groupedData) {
      const _res = parseData({ data: groupedData, keys: chosenKey })
      const _data = _res.map(({ x, y, name }) => getLayers({
        x,
        y,
        name,
        specs
      }))
      handleDispatch({ data: _data, ready: true })()
    }
    if (!isJson && groupedData) {
      const _data = getChartData({
        sumData: groupedData,
        chosenKey,
      })({ specs })
      if (multiAxis) {
        handleDispatch({
          data: _data
            .slice(0, 2)
            .map((d, i) => {
              let _data = d
              if (i === 1) {
                _data = { ...d, yaxis: 'y2' }
              }
              return _data
            })
        })()
      } else {
        handleDispatch({ data: _data })()
      }
    }
  }, [isJson, groupedData, area, chosenKey, multiAxis, handleDispatch])

  return (
    <>
      <div className={classes.row1}>
        <CustomSelect
          title='Column 1'
          data={columns}
          chosenValue={xAxis}
          setChosenValue={handleDispatch({ key: 'xAxis', type: 'WIDGETS' })}
        />
        <CustomSelect
          multi
          title='Columns 2'
          data={columns}
          chosenValue={yAxis}
          setChosenValue={handleDispatch({ key: 'yAxis', type: 'WIDGETS' })}
        />
      </div>
      {groupingOptions.length > 1 &&
        <>
          <CustomSelect
            multi
            title='Group By'
            data={groupingOptions.sort()}
            chosenValue={chosenKey}
            setChosenValue={handleDispatch({ key: 'chosenKey' })}
          />
          <IconButton
            size='small'
            onClick={() => handleDispatch({ chosenKey: [] })()}
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
            onChange={({ target: { checked } }) => setLineState({ area: checked })}
            name='Area'
          />}
          label='Area'
        />
        {(!isJson && yAxis.length > 1) &&
          <FormControlLabel
            control={<Switch
              checked={multiAxis}
              onChange={({ target: { checked } }) => setLineState({ multiAxis: checked })}
              name='Multi Axis'
            />}
            label='Multi Axis'
          />
        }
      </FormGroup>
    </>
  )
}

export default LineControls
