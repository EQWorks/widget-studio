import React from 'react'

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

  return (
    <WidgetControlCard title='Options'>
      <CustomToggle
        value={type === 'pie' ? true : subPlots}
        label='Subplots'
        callback={(val) => nestedUpdate({ genericOptions: { subPlots: val } })}
        disabled={valueKeys.length <= 1 || type === 'pie'}
      />
    </WidgetControlCard>
  )
}

export default GenericOptionControls
