import React, { useEffect } from 'react'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { positions, sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './components/color-scheme-controls'
import { renderItem, renderSection, renderRow, renderToggle, renderSuperSection } from '../shared/util'
import UniqueOptionControls from './components/unique-option-controls'
import EditorSidebarBase from './sidebar-base'
import MapLayerDisplay from './map-layer-display'
import Filters from './components/filters'
import CustomDropdown from './components/custom-dropdown'
import MutedBarrier from '../shared/muted-barrier'
import { MAP_LEGEND_SIZE, MAP_VALUE_VIS } from '../../constants/map'
import ExportControls from './components/export-controls'


const classes = makeStyles({
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
  const update = useStoreActions((state) => state.update)
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const type = useStoreState((state) => state.type)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const domain = useStoreState((state) => state.domain)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)
  const showWidgetTitle = useStoreState((state) => state.genericOptions.showWidgetTitle)
  const size = useStoreState((state) => state.genericOptions.size)
  const titlePosition = useStoreState((state) => state.genericOptions.titlePosition)
  const legendPosition = useStoreState((state) => state.genericOptions.legendPosition)
  const legendSize = useStoreState((state) => state.genericOptions.legendSize)
  const showLegend = useStoreState((state) => state.genericOptions.showLegend)
  const showAxisTitles = useStoreState((state) => state.genericOptions.showAxisTitles)
  const showSubPlotTitles = useStoreState((state) => state.genericOptions.showSubPlotTitles)
  const showTooltip = useStoreState((state) => state.genericOptions.showTooltip)
  const showLabels = useStoreState((state) => state.genericOptions.showLabels)

  useEffect(() => {
    if (renderableValueKeys?.length <= 1) {
      update({ genericOptions: { subPlots: false } })
    }
  }, [renderableValueKeys?.length, update])

  const renderGenericOptions = (
    <>
      {
        renderRow(null,
          type !== types.MAP &&
          <>
            {
              renderToggle(
                'Title',
                showWidgetTitle,
                v => userUpdate({ genericOptions: { showWidgetTitle: v } }),
              )
            }
            {type !== types.PIE &&
              renderToggle(
                'Axis Titles',
                showAxisTitles,
                v => userUpdate({ genericOptions: { showAxisTitles: v } }),
                false
              )
            }
            {(subPlots || type === types.PIE) &&
              renderToggle(
                'Subplot Titles',
                showSubPlotTitles,
                v => userUpdate({ genericOptions: { showSubPlotTitles: v } }),
              )
            }
          </>,
          null,
          subPlots && type !== types.PIE // really dumb, but temporary until control item layout mechanism is reworked
        )
      }
      {
        renderRow(null,
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
            {type === types.MAP && !JSON.stringify(renderableValueKeys)?.includes(MAP_VALUE_VIS.elevation) &&
              renderToggle(
                'Labels',
                showLabels,
                v => userUpdate({ genericOptions: { showLabels: v } }),
              )
            }
            {![types.PIE, types.MAP].includes(type) &&
              renderToggle(
                'Subplots',
                subPlots,
                v => userUpdate({ genericOptions: { subPlots: v } }),
                renderableValueKeys?.length <= 1
              )
            }
          </>
        )
      }
    </>
  )

  const renderStyling = (
    <>
      {type !== types.MAP && renderItem('Title Position',
        <CustomDropdown
          selectedString={positions.string[positions.numeric.map(JSON.stringify)
            .indexOf(JSON.stringify(titlePosition))]}
          classes={{ menu: classes.xyDropdownMenu }}
          disabled={!showWidgetTitle && (!showSubPlotTitles || !subPlots)}
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

  const renderStylingSecondRow = (
    renderItem('Subplot Size',
      <CustomSelect
        fullWidth
        allowClear={false}
        data={sizes.string}
        value={sizes.string[sizes.numeric.indexOf(size)]}
        onSelect={v => userUpdate({ genericOptions: { size: sizes.dict[v] } })}
      />
    )
  )

  return (
    <EditorSidebarBase>
      <MutedBarrier mute={!type || !domain?.value || !(renderableValueKeys?.length)} >
        <Filters />
        <WidgetControlCard title={type === types.MAP ? 'Map Settings' : 'Chart Settings'}>
          {
            renderSuperSection(
              <>
                {renderSection(
                  'Display Options',
                  <>
                    {renderGenericOptions}
                    {type !== types.MAP && renderRow(null, <UniqueOptionControls type={type} />)}
                  </>
                )}
                {renderSection('Styling',
                  <>
                    {renderRow(null, renderStyling)}
                    {type !== types.MAP && subPlots && renderRow(null, renderStylingSecondRow)}
                  </>
                )}
                {type === types.MAP && <MapLayerDisplay />}
              </>
            )
          }
        </WidgetControlCard >
        {
          type !== types.MAP &&
          <WidgetControlCard title='Color Scheme'>
            <ColorSchemeControls />
          </WidgetControlCard >
        }
        <ExportControls />
      </MutedBarrier>
    </EditorSidebarBase >
  )
}

export default EditorRightSidebar
