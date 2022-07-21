import React from 'react'

import { useStoreState } from '../../store'
import types from '../../constants/types'
import WidgetTypeControls from '../shared/type-controls'
import DomainControls from '../shared/domain-controls'
import MapDomainControls from '../shared/map-domain-controls'
import ValueControls from '../shared/value-controls'
import MapValueControls from '../shared/map-value-controls'
import EditorSidebarBase from './sidebar-base'
import DataTransformationControls from '../shared/data-transformation-controls'
import DataSourceControls from './components/data-source-controls'
import BenchmarkControls from './components/benchmark-controls'
import { hasDevAccess  } from '../../util/access'


const EditorLeftSidebar = () => {
  const type = useStoreState((state) => state.type)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const addBenchmark = useStoreState((state) => state.addBenchmark)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)

  return (
    <EditorSidebarBase isLeft>
      <DataSourceControls />
      <WidgetTypeControls />
      {
        type && type === types.MAP
          ? <>
            {!dataIsXWIReport && <MapDomainControls />}
            <MapValueControls />
          </>
          : <>
            <DomainControls />
            <ValueControls />
            {![types.PYRAMID, types.STAT].includes(type) && <DataTransformationControls />}
            {/* restrict to dev only for now */}
            { hasDevAccess() && type === types.BAR && numericColumns.length > 1 &&
              ((renderableValueKeys.length <= 1 && !addBenchmark) || addBenchmark) &&
              <BenchmarkControls />
            }
          </>
      }
    </EditorSidebarBase>
  )
}

export default EditorLeftSidebar
