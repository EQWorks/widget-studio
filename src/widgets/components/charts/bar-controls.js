import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { useStoreState, useStoreActions } from 'easy-peasy'
import CustomSelect from '../custom-select'
import { parseData, groupJson, getChartData, getLayers, sum } from './utils'


const useStyles = makeStyles((theme) => ({
  row1: { marginBottom: theme.spacing(2.5) },
  row3: { padding: '30px 0 20px 0' },
}))

const useBarControls = ({ columns, results }) => {
  const classes = useStyles()
  const xAxis = useStoreState((state) => state.widgets.initState.xAxis)
  const yAxis = useStoreState((state) => state.widgets.initState.yAxis)

  const data = useStoreState((state) => state.widgets.controllers.data)
  const groupedData = useStoreState((state) => state.widgets.controllers.groupedData)
  const options = useStoreState((state) => state.widgets.controllers.options)
  const chosenKey = useStoreState((state) => state.widgets.controllers.chosenKey)
  const groupMode = useStoreState((state) => state.widgets.bar.groupMode)
  const layout = useStoreState((state) => state.widgets.bar.layout)
  const isJson = useStoreState((state) => state.widgets.isJson)

  const handleDispatch = useStoreActions(actions => actions.widgets.handleDispatch)
  const setBarState = useStoreActions(actions => actions.widgets.bar.update)

  const isVertical = layout === 'vertical'

  useEffect(() => {
    const resultsCopy = JSON.parse(JSON.stringify(results))
    handleDispatch({ groupedData: null })()
    if (isJson) {
      handleDispatch({ ready: false })()
      const [_options, _groupedData] = groupJson({ results: resultsCopy, groupKey: xAxis, key: yAxis[0] })
      handleDispatch({
        options: _options,
        groupedData: _groupedData,
      })()
    } else {
      const _groupedData = sum({
        results: resultsCopy,
        groupKey: xAxis,
        yKeys: yAxis,
      })
      handleDispatch({
        options: Object.keys(_groupedData),
        groupedData: _groupedData,
      })()
    }
  }, [handleDispatch, isJson, isVertical, results, xAxis, yAxis])

  useEffect(() => {
    const specs = {
      type: 'bar',
      orientation: isVertical ? 'v' : 'h',
      hovertemplate: '<b> %{fullData.name} </b>' +
      // '<br> %{x}: %{y} ' +
      '<br><b> %{xaxis.title.text}</b>: %{x} ' +
      '<br><b> %{yaxis.title.text}</b>: %{y} <br>' +
      '<extra></extra>',
      isVertical,
    }
    if (isJson && groupedData) {
      const _res = parseData({ data: groupedData, keys: chosenKey })
      const _data = _res.map(({ x, y, name }) => getLayers({
        x,
        y,
        name,
        specs,
      }))
      handleDispatch({ data: _data, ready: true })()
    }
    if (!isJson && groupedData) {
      const _data = getChartData({
        sumData: groupedData,
        chosenKey,
      })({ specs })
      handleDispatch({ data: _data })()
    }
  }, [chosenKey, handleDispatch, groupedData, isJson, isVertical])

  const islongTickLabel = (axis) => {
    if (data && data[0]) {
      return data[0][axis]?.some((e) => e?.length > 4)
    } else {
      return false
    }
  }

  const getTitle = (axis) => ({
    x: isVertical ? isJson || xAxis : 'value',
    y: isVertical ? 'value' : isJson || xAxis
  }[axis])

  const props = {
    data,
    layout:{
      autosize: true,
      hovermode: 'closest',
      hoverlabel: { align: 'left', bgcolor: 'fff' },
      colorway: ['#0062d9', '#f65b20', '#ffaa00', '#dd196b', '#9928b3', '#00b5c8', '#a8a8a8'],
      yaxis: {
        // visible: !islongTickLabel('y'),
        title: {
          text: getTitle('y'),
          standoff: isVertical ? 5 : 20
        },
        automargin: true,
        ticklen: 8,
        showline: true,
      },
      xaxis: {
        // visible: !islongTickLabel('x'),
        title: {
          text: getTitle('x'),
          standoff: isVertical ? 5 : 20
        },
        automargin: true,
        tickangle: islongTickLabel('x') ? 45 : 0,
        ticklen: 8,
      },
      ...( data?.length > 1 ? { barmode: groupMode } : {}),
    },
    useResizeHandler: true,
  }
  const getBarControls = () => {
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
              onClick={() => handleDispatch({ chosenKey: [] })()}
            >
              <Clear />
            </IconButton>
          </>
        }
        <div className={classes.row3}>
          <FormControl component='fieldset'>
            <RadioGroup aria-label='layout' name='layout1' value={layout} onChange={({ target: { value } }) => setBarState({ layout: value })}>
              <FormControlLabel value='vertical' control={<Radio />} label='Vertical' />
              <FormControlLabel value='horizontal' control={<Radio />} label='Horizontal' />
            </RadioGroup>
          </FormControl>
        </div>

        {(yAxis.length > 1 || options.length > 1) &&
        <FormControl component='fieldset'>
          <RadioGroup aria-label='groupMode' name='group1' value={groupMode} onChange={({ target: { value } }) => setBarState({ groupMode: value })}>
            <FormControlLabel value='group' control={<Radio />} label='Grouped' />
            <FormControlLabel value='stack' control={<Radio />} label='Stacked' />
          </RadioGroup>
        </FormControl>}
      </>
    )
  }
  return [props, getBarControls]
}

export default useBarControls
