import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import types from '../../constants/types'
import WidgetTypeControls from '../shared/type-controls'
import DomainControls from '../shared/domain-controls'
import MapDomainControls from '../shared/map-domain-controls'
import ValueControls from '../shared/value-controls'
import MapValueControls from '../shared/map-value-controls'
import EditorSidebarBase from './sidebar-base'
import DataTransformationControls from '../shared/data-transformation-controls'
import DataSourceControls from './components/data-source-controls'
import UserValueConfigurationControls from './components/user-value-configuration-controls'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderToggle } from '../shared/util'
import { hasDevAccess  } from '../../util/access'


const EditorLeftSidebar = () => {
  const userUpdate = useStoreActions(actions => actions.userUpdate)

  const type = useStoreState((state) => state.type)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const addUserControls = useStoreState((state) => state.addUserControls)
  const addTopCategories = useStoreState((state) => state.addTopCategories)
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
            {type !== types.PYRAMID && <DataTransformationControls />}
          </>
      }
      {/* restrict to dev only for now */}
      {hasDevAccess() && [types.BAR, types.LINE].includes(type) && !addUserControls &&
        <WidgetControlCard title='Top Categories'>
          {
            renderToggle('Add Top Categories',
              addTopCategories,
              () => userUpdate({ addTopCategories: !addTopCategories }),
            )
          }
        </WidgetControlCard>
      }
      {hasDevAccess() && ((type == types.BAR && numericColumns.length > 1 &&
        ((renderableValueKeys.length <= 1 && !addUserControls) || addUserControls)) ||
        (type == types.MAP && numericColumns.length > 0 && renderableValueKeys.length === 1)) &&
        <UserValueConfigurationControls />
      }
    </EditorSidebarBase>
  )
}

export default EditorLeftSidebar
