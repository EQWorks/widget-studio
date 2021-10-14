import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import CustomToggle from '../shared-components/custom-toggle'
import WidgetControlCard from '../shared-components/widget-control-card'


const GenericOptionControls = () => {

  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const valueKeys = useStoreState((state) => state.valueKeys)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)

  return (
    <WidgetControlCard title='Options'>
      <CustomToggle
        value={subPlots}
        label='Subplots'
        update={(val) => nestedUpdate({ genericOptions: { subPlots: val } })}
        disabled={valueKeys.length <= 1}
      />
    </WidgetControlCard>
  )
}

export default GenericOptionControls
