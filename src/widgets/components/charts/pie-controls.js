import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { Switch } from '@eqworks/lumen-ui'
import { useStoreState, useStoreActions } from 'easy-peasy'
import CustomSelect from '../custom-select'
import { getPieChartData, sum } from './utils'


const useStyles = makeStyles((theme) => ({
  row1: { marginBottom: theme.spacing(2.5) },
  row3: { padding: '30px 0 20px 0' },
}))

const usePieControls = ({ columns, results }) => {
  const classes = useStyles()
  const xAxis = useStoreState((state) => state.widgets.initState.xAxis)
  const yAxis = useStoreState((state) => state.widgets.initState.yAxis)

  const data = useStoreState((state) => state.widgets.controllers.data)
  const groupedData = useStoreState((state) => state.widgets.controllers.groupedData)
  const options = useStoreState((state) => state.widgets.controllers.options)
  const chosenKey = useStoreState((state) => state.widgets.controllers.chosenKey)
  const isDonut = useStoreState((state) => state.widgets.pie.isDonut)
  const multi = useStoreState((state) => state.widgets.pie.multi)

  const handleDispatch = useStoreActions(actions => actions.widgets.handleDispatch)
  const setPieState = useStoreActions(actions => actions.widgets.pie.update)
  const capData = useStoreActions(actions => actions.widgets.pie.capData)

  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(results))
    handleDispatch({ ready: false })()
    // setChosenKey([])
    const _groupedData = sum({
      results: resultsCopy,
      groupKey: xAxis,
      yKeys: yAxis,
    })
    handleDispatch({
      options: Object.keys(_groupedData),
      groupedData: _groupedData,
    })()
  }, [handleDispatch, results, xAxis, yAxis])

  useEffect(() => {
    if (options.length) {
      if (yAxis.length > 1) {
        handleDispatch({ chosenKey: [options[0]] })()
      } else {
        handleDispatch({ chosenKey: [] })()
      }
    }
  }, [handleDispatch, options, yAxis])

  useEffect(() => {
    let values
    let labels
    const specs = {
      type: 'pie',
      values,
      labels,
      textposition: 'inside',
      hovertemplate:'<b>%{fullData.name}</b>' +
      '<br><b>%{label}</b>: %{value} ' +
      '<br><b>percent</b>: %{percent} ' +
      '<extra></extra>',
      ...(isDonut? { hole: .5 } : {})
    }
    if (groupedData) {
      const _data = getPieChartData({
        sumData: groupedData,
        chosenKey,
        yKeys: yAxis
      })({ specs })
      handleDispatch({ data: _data })()
    }
    handleDispatch({ ready: true })()
  }, [chosenKey, groupedData, handleDispatch, isDonut, options, results, xAxis, yAxis])

  useEffect(() => {
    /** logic to create grid view */
    if (chosenKey.length > 1 && yAxis.length > 1) {
      /** to avoid too many re-render this logic was moved to capData()
       * it should cap the data length at 3 for the side by side view
       */
      capData()
      const positionX = [0.1, 0.5, 0.9, 0.12, 0.5, 0.87]
      const positionY = [1.2, 1.2, 1.2, 2, 2, 2] // upper
      const multiLayout = {
        grid: { rows: 1, columns: 3 },
        annotations:
          chosenKey.slice(0, 3).map((key, i) => ({
            font: { size: 15 },
            text: handleText(key),
            showarrow: false,
            x: positionX[i],
            y: positionY[i],
          }))
      }
      setPieState({ multi: multiLayout })
    } else {
      setPieState({ multi: {} })
    }
  }, [chosenKey, yAxis, isDonut, handleDispatch, setPieState, capData])

  const handleText = (str) => {
    // const size = str.length
    //   ? `${_str.slice(0, 12)}<br />${_str.slice(12)}`
    // return size > 12
    //   : _str
    const _str = str.replace(/[^A-Za-zÀ-ÿ &]+/g, '')
      .trim()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
    return _str
  }


  const props = {
    data,
    layout: {
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      autosize: true,
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      ...multi,
    },
  }

  const getPieControls = () => {
    return (
      <>
        <div className={classes.row1}>
          <CustomSelect
            title='Key X'
            data={columns}
            chosenValue={xAxis}
            setChosenValue={handleDispatch({ key: 'xAxis', type: 'WIDGETS' })}
          />
          <CustomSelect
            multi
            title='Keys Y'
            data={columns}
            chosenValue={yAxis}
            setChosenValue={handleDispatch({ key: 'yAxis', type: 'WIDGETS' })}
          />
        </div>
        {options.length > 1 &&
        <>
          <CustomSelect
            multi
            title='Group By'
            data={options.sort()}
            chosenValue={chosenKey}
            setChosenValue={handleDispatch({ key: 'chosenKey' })}
          />
          <IconButton
            size='small'
            onClick={() => handleDispatch({ chosenKey: yAxis.length > 1 ? [options[0]] : [] })()}
          >
            <Clear />
          </IconButton>
        </>
        }
        <FormGroup className={classes.row3}>
          <FormControlLabel
            control={<Switch
              checked={isDonut}
              onChange={({ target: { checked } }) => setPieState({ isDonut: checked })}
              name='style'
            />}
            label='Donut'
          />
        </FormGroup>
      </>
    )
  }
  return [props, getPieControls]
}

export default usePieControls
