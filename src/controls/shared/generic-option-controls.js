import React from 'react'

import { HuePicker } from 'react-color'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import { sizes, positions } from '../../constants/viz-options'
import CustomToggle from '../../components/custom-toggle'
import CustomSelect from '../../components/custom-select'


const GenericOptionControls = () => {

  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const type = useStoreState((state) => state.type)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)
  const size = useStoreState((state) => state.genericOptions.size)
  const titlePosition = useStoreState((state) => state.genericOptions.titlePosition)
  const legendPosition = useStoreState((state) => state.genericOptions.legendPosition)
  const baseColor = useStoreState((state) => state.genericOptions.baseColor)
  const showLegend = useStoreState((state) => state.genericOptions.showLegend)

  const renderItem = (title, Component) => (
    <div className='my-1 flex items-center text-sm text-secondary-500'>
      <div className='flex-1 flex items-center'>
        {Component}
      </div>
      <div className='mx-4 flex-0'>
        {title}
      </div>
    </div>
  )

  return (
    <WidgetControlCard title='Options'>
      {
        renderItem(
          'Show legend',
          <CustomToggle
            value={showLegend}
            onChange={(val) => nestedUpdate({ genericOptions: { showLegend: val } })}
          />
        )
      }
      {
        type !== 'pie' &&
        renderItem(
          'Subplots',
          <CustomToggle
            value={subPlots}
            onChange={(val) => nestedUpdate({ genericOptions: { subPlots: val } })}
            disabled={valueKeys.length <= 1}
          />
        )
      }
      {
        renderItem(
          'Size',
          <CustomSelect
            data={sizes.string}
            value={sizes.string[sizes.numeric.indexOf(size)]}
            onSelect={v => nestedUpdate({ genericOptions: { size: sizes.dict[v] } })}
          />
        )
      }
      {
        subPlots &&
        renderItem(
          'Title position',
          <CustomSelect
            data={positions.string}
            value={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(titlePosition))]}
            onSelect={v => nestedUpdate({ genericOptions: { titlePosition: positions.dict[v] } })}
          />
        )
      }
      {
        showLegend &&
        renderItem(
          'Legend position',
          <CustomSelect
            data={positions.string.filter(s => positions.dict[s].every(n => n === 0 || n === 1))} // only include corners
            value={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(legendPosition))]}
            onSelect={v => nestedUpdate({ genericOptions: { legendPosition: positions.dict[v] } })}
          />
        )
      }
      {
        renderItem(
          'Base color',
          <HuePicker
            width='100%'
            color={baseColor}
            onChange={({ hex }) => nestedUpdate({ genericOptions: { baseColor: hex } })}
          />
        )
      }
    </WidgetControlCard>
  )
}

export default GenericOptionControls
