import React from 'react'


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

  const renderItem = (title, Component) => (
    <div className='flex items-center text-sm text-secondary-500'>
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
        type !== 'pie' &&
        <CustomToggle
          value={subPlots}
          label='Subplots'
          onChange={(val) => nestedUpdate({ genericOptions: { subPlots: val } })}
          disabled={valueKeys.length <= 1}
        />
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
    </WidgetControlCard>
  )
}

export default GenericOptionControls
