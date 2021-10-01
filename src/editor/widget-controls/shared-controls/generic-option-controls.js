import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'
import {
  Toggle,
  WidgetControlCard as Card,
} from '../../shared-components'

const GenericOptionControls = () => {

  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const valueKeys = useStoreState((state) => state.valueKeys)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)

  return (
    <Card title='Options'>
      <Toggle
        value={subPlots}
        label='Subplots'
        update={(val) => nestedUpdate({ genericOptions: { subPlots: val } })}
        disabled={Object.keys(valueKeys).length <= 1}
      />
    </Card>
  )
}

export default GenericOptionControls
