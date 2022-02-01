import React from 'react'

import { useStoreState } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import types from '../../constants/types'
import Icons from '../shared/widget-type-icons'
import ValueControls from '../shared/value-controls'
import MapValueControls from '../shared/map-value-controls'
import EditorSidebarBase from './sidebar-base'


const EditorLeftSidebar = () => {
  const dataReady = useStoreState((state) => state.dataReady)
  const type = useStoreState((state) => state.type)
  return (
    <EditorSidebarBase>
      <WidgetControlCard title='Widget Type'>
        <Icons disabled={!dataReady} />
      </WidgetControlCard>
      {
        type === types.MAP
          ? <MapValueControls />
          : <ValueControls />
      }
    </EditorSidebarBase>
  )
}

export default EditorLeftSidebar
