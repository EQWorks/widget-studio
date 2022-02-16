import React from 'react'

import { useStoreState } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import types from '../../constants/types'
import Icons from '../shared/type-controls'
import DomainControls from '../shared/domain-controls'
import MapDomainControls from '../shared/map-domain-controls'
import ValueControls from '../shared/value-controls'
import MapValueControls from '../shared/map-value-controls'
import EditorSidebarBase from './sidebar-base'
import DataTransformationControls from '../shared/data-transformation-controls'


const EditorLeftSidebar = () => {
  const dataReady = useStoreState((state) => state.dataReady)
  const type = useStoreState((state) => state.type)
  return (
    <EditorSidebarBase>
      <WidgetControlCard title='Widget Type'>
        <Icons disabled={!dataReady} />
      </WidgetControlCard>
      {
        type && type === types.MAP
          ? <>
            <MapDomainControls />
            <MapValueControls />
          </>
          : <>
            <DomainControls />
            <ValueControls />
            <DataTransformationControls />
          </>
      }
    </EditorSidebarBase>
  )
}

export default EditorLeftSidebar
