import React from 'react'

import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import StylingMap from './styling-map'
import WidgetControlCard from '../shared/components/widget-control-card'
import { positions, sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './components/color-scheme-controls'
import { renderItem, renderSection, renderRow, renderToggle } from '../shared/util'
import UniqueOptionControls from './components/unique-option-controls'
import EditorSidebarBase from './sidebar-base'
import Filters from './filters'
import CustomDropdown from './components/custom-dropdown'
import MutedBarrier from '../shared/muted-barrier'


const classes = makeStyles({
  xyDropdownMenu: {
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const EditorRightSidebar = () => {
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const type = useStoreState((state) => state.type)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const domain = useStoreState((state) => state.domain)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)
  const showWidgetTitle = useStoreState((state) => state.genericOptions.showWidgetTitle)
  const size = useStoreState((state) => state.genericOptions.size)
  const titlePosition = useStoreState((state) => state.genericOptions.titlePosition)
  const legendPosition = useStoreState((state) => state.genericOptions.legendPosition)
  const showLegend = useStoreState((state) => state.genericOptions.showLegend)

  return (
    <EditorSidebarBase>
      <MutedBarrier mute={!type || !domain?.value || !(renderableValueKeys.length)} >
        <Filters />
        <WidgetControlCard title='Styling'>
          {type !== types.MAP &&
            renderSection(null,
              <>
                {renderRow(null,
                  <>
                    {renderItem('Title Position',
                      <CustomDropdown
                        selectedString={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(titlePosition))]}
                        classes={{ menu: classes.xyDropdownMenu }}
                        disabled={!showWidgetTitle && !subPlots}
                      >
                        <XYSelect
                          value={titlePosition}
                          disabled={[[0.5, 0.5], [0, 0.5], [1, 0.5]]}
                          update={titlePosition => userUpdate({ genericOptions: { titlePosition } })}
                        />
                      </CustomDropdown>
                    )}
                    {renderItem('Legend Position',
                      <CustomDropdown
                        disabled={!showLegend}
                        selectedString={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(legendPosition))]}
                        classes={{ menu: classes.xyDropdownMenu }}
                      >
                        <XYSelect
                          value={legendPosition}
                          update={legendPosition => userUpdate({ genericOptions: { legendPosition } })}
                        />
                      </CustomDropdown>
                    )}
                  </>
                )}
                {subPlots && renderRow('Subplot Size',
                  <CustomSelect
                    fullWidth
                    data={sizes.string}
                    value={sizes.string[sizes.numeric.indexOf(size)]}
                    onSelect={v => userUpdate({ genericOptions: { size: sizes.dict[v] } })}
                  />
                )}
              </>
            )
          }
          {renderSection(
            'Display Options',
            <>
              {type === types.MAP && <StylingMap />}
              {type !== types.MAP &&
                <>
                  <WidgetControlCard title='Styling'>
                    {renderSection(null,
                      <>
                        {renderRow(null,
                          <>
                            {renderToggle(
                              'Legend',
                              showLegend,
                              v => userUpdate({ genericOptions: { showLegend: v } }),
                            )}
                            {type !== types.PIE && type !== types.MAP &&
                              renderToggle(
                                'Subplots',
                                subPlots,
                                v => userUpdate({ genericOptions: { subPlots: v } }),
                                valueKeys.length <= 1
                              )}
                            {type !== types.MAP &&
                              renderToggle(
                                'Widget Title',
                                showWidgetTitle,
                                v => userUpdate({ genericOptions: { showWidgetTitle: v } }),
                              )}
                          </>
                        )}
                        <UniqueOptionControls type={type} />
                      </>
                    )}
                  </WidgetControlCard >
                  <WidgetControlCard title='Colour Scheme'>
                    <ColorSchemeControls />
                  </WidgetControlCard >
                </>
              }
            </>
          )}
        </WidgetControlCard >
      </MutedBarrier>
    </EditorSidebarBase >
  )
}

export default EditorRightSidebar
