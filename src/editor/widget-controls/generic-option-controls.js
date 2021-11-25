import React from 'react'

import MuiSlider from '@material-ui/core/Slider'

import { useStoreState, useStoreActions } from '../../store'
import CustomToggle from '../shared-components/custom-toggle'
import WidgetControlCard from '../shared-components/widget-control-card'


const GenericOptionControls = () => {

  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const type = useStoreState((state) => state.type)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)
  const size = useStoreState((state) => state.genericOptions.size)
  const titleX = useStoreState((state) => state.genericOptions.titleX)
  const titleY = useStoreState((state) => state.genericOptions.titleY)

  const renderSlider = (title, value, update) => {
    return <div className='flex items-center text-sm text-secondary-500'>
      <div className='flex-1 flex items-center'>
        <MuiSlider
          valueLabelDisplay='off'
          value={value}
          min={0}
          step={0.01}
          max={1}
          onChange={update}
        />
      </div>
      <div className='mx-4 flex-0'>
        {title}
      </div>
    </div>
  }

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
        subPlots &&
        <>
          {renderSlider('Size', size, (_, val) => nestedUpdate({ genericOptions: { size: val } }))}
          {renderSlider('Title X', titleX, (_, val) => nestedUpdate({ genericOptions: { titleX: val } }))}
          {renderSlider('Title Y', titleY, (_, val) => nestedUpdate({ genericOptions: { titleY: val } }))}
        </>
      }
    </WidgetControlCard>
  )
}

export default GenericOptionControls
