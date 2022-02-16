import React from 'react'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { positions, sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './components/color-scheme-controls'
import { renderItem, renderSection, renderRow, renderToggle } from '../shared/util'
import UniqueOptionControls from './components/unique-option-controls'
import EditorSidebarBase from './sidebar-base'
import MapLayerDisplay from './map-layer-display'
import Filters from './filters'
import CustomDropdown from './components/custom-dropdown'
import MutedBarrier from '../shared/muted-barrier'
import { MAP_LEGEND_SIZE } from '../../constants/map'
import ExportControls from './components/export-controls'


const classes = makeStyles({
  displayOptions: {
    marginTop: '0.625rem',
  },
  xyDropdownMenu: {
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendSize: {
    color: getTailwindConfigColor('primary-600'),
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
  const legendSize = useStoreState((state) => state.genericOptions.legendSize)
  const showLegend = useStoreState((state) => state.genericOptions.showLegend)
  const showTooltip = useStoreState((state) => state.genericOptions.showTooltip)

  return (
    <EditorSidebarBase>
      <MutedBarrier mute={!type || !domain?.value || !(renderableValueKeys.length)} >
        <Filters />
        <WidgetControlCard title={type === types.MAP ? 'Map Settings' : 'Chart Settings'}>
          <div className={classes.displayOptions}>
            {renderSection(
              'Display Options',
              <>
                {renderRow(null,
                  <>
                    {renderToggle(
                      'Legend',
                      showLegend,
                      v => userUpdate({ genericOptions: { showLegend: v } }),
                    )}
                    {type === types.MAP &&
                      renderToggle(
                        'Tooltip',
                        showTooltip,
                        v => userUpdate({ genericOptions: { showTooltip: v } }),
                      )
                    }
                    {type !== types.MAP && type !== types.PIE &&
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
                      )
                    }
                  </>
                )}
                {type !== types.MAP &&
                  <UniqueOptionControls type={type} />
                }
              </>
            )}
          </div>
          {
            renderSection(
              'Styling',
              renderRow(
                null,
                <>
                  {type !== types.MAP && renderItem('Title Position',
                    <CustomDropdown
                      selectedString={positions.string[positions.numeric.map(JSON.stringify)
                        .indexOf(JSON.stringify(titlePosition))]}
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
                      selectedString={positions.string[positions.numeric.map(JSON.stringify)
                        .indexOf(JSON.stringify(legendPosition))]}
                      classes={{ menu: classes.xyDropdownMenu }}
                    >
                      <XYSelect
                        value={legendPosition}
                        update={legendPosition => userUpdate({ genericOptions: { legendPosition } })}
                        disabled={type === types.MAP ?
                          [[0.5, 0.5], [0, 0.5], [1, 0.5], [0.5, 0], [0.5, 1]] :
                          [[0.5, 0.5]]}
                      />
                    </CustomDropdown>
                  )}
                  {type === types.MAP && renderItem('Legend Size',
                    <CustomSelect
                      allowClear={false}
                      disabled={!showLegend}
                      fullWidth
                      data={Object.keys(MAP_LEGEND_SIZE)}
                      value={legendSize}
                      onSelect={legendSize => userUpdate({ genericOptions: { legendSize } })}
                      placeholder={!showLegend ? 'N/A' : 'Select'}
                      renderSelectedOptions={() =>
                        showLegend &&
                        <span className={classes.legendSize}>
                          {legendSize}
                        </span>
                      }
                    />
                  )}
                </>
              )
            )
          }
          {
            type !== types.MAP && subPlots &&
            renderRow(
              null,
              <>
                {
                  renderItem('Subplot Size',
                    <CustomSelect
                      fullWidth
                      allowClear={false}
                      data={sizes.string}
                      value={sizes.string[sizes.numeric.indexOf(size)]}
                      onSelect={v => userUpdate({ genericOptions: { size: sizes.dict[v] } })}
                    />
                  )
                }
                {/* for spacing */}
                {renderItem(null, <></>)}
              </>
            )
          }
          {type === types.MAP &&
            <MapLayerDisplay />
          }
        </WidgetControlCard >
        {type !== types.MAP &&
          <WidgetControlCard title='Colour Scheme'>
            <ColorSchemeControls />
          </WidgetControlCard >
        }
        <ExportControls />
      </MutedBarrier>
    </EditorSidebarBase >
  )
}

export default EditorRightSidebar
