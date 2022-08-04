import React from 'react'

import { Tooltip, Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import types from '../../constants/types'
import WidgetTypeControls from '../shared/type-controls'
import DomainControls from '../shared/domain-controls'
import MapDomainControls from '../shared/map-domain-controls'
import ValueControls from '../shared/value-controls'
import MapValueControls from '../shared/map-value-controls'
import MutedBarrier from '../shared/muted-barrier'
import EditorSidebarBase from './sidebar-base'
import DataTransformationControls from '../shared/data-transformation-controls'
import DataSourceControls from './components/data-source-controls'
import UserValueConfigurationControls from './components/user-value-configuration-controls'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderToggle } from '../shared/util'
import { hasDevAccess  } from '../../util/access'


const classes = makeStyles({
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2.75rem',
  },
})

const EditorLeftSidebar = () => {
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const update = useStoreActions(actions => actions.update)

  const type = useStoreState((state) => state.type)
  const columns = useStoreState((state) => state.columns)
  const domain = useStoreState((state) => state.domain)
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
      {hasDevAccess() &&
        <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length}>
          <WidgetControlCard title=''>
            <div className={classes.row}>
              {[types.BAR, types.MAP].includes(type) &&
                <MutedBarrier mute={addTopCategories ||
                  !((type == types.BAR && numericColumns.length > 1 &&
                    ((renderableValueKeys.length <= 1 && !addUserControls) || addUserControls)) ||
                    (type == types.MAP && numericColumns.length > 0 && renderableValueKeys.length === 1))}>
                  {renderToggle(
                    type === types.MAP ? 'Add Value Controls' : 'Add Benchmark',
                    addUserControls,
                    () => userUpdate({ addUserControls: !addUserControls }),
                    false,
                    <Tooltip
                      description={type === types.MAP ?
                        'Add data value controls on the widget' :
                        'Benchmark values are unique values used to compare data with.'
                      }
                      width='9rem'
                      arrow={false}
                      position='right'
                      classes={{
                        container: 'mb-0.5',
                        content: 'overflow-y-visible',
                      }}
                    >
                      <Icons.AlertInformation
                        size='sm'
                        color={getTailwindConfigColor('secondary-500')}
                      />
                    </Tooltip>
                  )}
                </MutedBarrier>
              }
              {type === types.BAR &&
                ['category', 'ranking'].every(elem => JSON.stringify(columns).includes(elem)) &&
                <MutedBarrier mute={addUserControls}>
                  {renderToggle('Add Top Categories',
                    addTopCategories,
                    () => {
                      if (addTopCategories) {
                        update({ propFilters: [] })
                      }
                      userUpdate({ addTopCategories: !addTopCategories })
                    },
                    false,
                    <Tooltip
                      description={'Add top 10 category controls.'}
                      width='9rem'
                      arrow={false}
                      position='right'
                      classes={{
                        container: 'mb-0.5',
                        content: 'overflow-y-visible',
                      }}
                    >
                      <Icons.AlertInformation
                        size='sm'
                        color={getTailwindConfigColor('secondary-500')}
                      />
                    </Tooltip>
                  )}
                </MutedBarrier>
              }
            </div>
          </WidgetControlCard>
          {((type == types.BAR && numericColumns.length > 1) ||
            (type == types.MAP && numericColumns.length > 0 && renderableValueKeys.length === 1)) &&
            <UserValueConfigurationControls />
          }
        </MutedBarrier>
      }
    </EditorSidebarBase>
  )
}

export default EditorLeftSidebar
