import React, { useEffect } from 'react'

import { TextField, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

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
import SliderControl from './components/slider-control'
import EditableSubtitle from '../../view/title-bar/editable-subtitle'
import { hasDevAccess  } from '../../util/access'


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

const textfieldClasses = Object.freeze({
  container: 'textfield-form',
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
  const labelPosition = useStoreState((state) => state.genericOptions.labelPosition)
  const legendSize = useStoreState((state) => state.genericOptions.legendSize)
  const showLegend = useStoreState((state) => state.genericOptions.showLegend)
  const showAxisTitles = useStoreState((state) => state.genericOptions.showAxisTitles)
  const axisTitles = useStoreState((state) => state.genericOptions.axisTitles)
  const showSubPlotTitles = useStoreState((state) => state.genericOptions.showSubPlotTitles)
  const showTooltip = useStoreState((state) => state.genericOptions.showTooltip)
  const showLabels = useStoreState((state) => state.genericOptions.showLabels)
  const showCurrency = useStoreState((state) => state.genericOptions.showCurrency)
  const showVertical = useStoreState((state) => state.genericOptions.showVertical)
  const showTitleBar = useStoreState((state) => state.showTitleBar)
  const isReady = useStoreState((state) => state.isReady)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  const xAxisLabelLength = useStoreState((state) => state.genericOptions.xAxisLabelLength)

  useEffect(() => {
    if (renderableValueKeys?.length <= 1) {
      update({ genericOptions: { subPlots: false } })
    }
  }, [renderableValueKeys?.length, update])

  const renderGenericOptions = (
    <>
      {
        renderRow(null,
          <>
            {type !== types.MAP &&
              renderToggle(
                'Title',
                showWidgetTitle,
                v => userUpdate({ genericOptions: { showWidgetTitle: v } }),
              )
            }
            {![types.STAT, types.TABLE, types.MAP].includes(type) &&
              renderToggle(
                'Legend',
                showLegend,
                v => userUpdate({ genericOptions: { showLegend: v } }),
              )
            }
            {type === types.STAT &&
              renderToggle(
                'Currency',
                showCurrency,
                v => userUpdate({ genericOptions: { showCurrency: v } }),
              )
            }
            {type === types.PYRAMID && renderItem('x-Axis Labels',
              <SliderControl
                style={'right'}
                range={false}
                min={1}
                max={10}
                value={xAxisLabelLength}
                update={v => userUpdate({
                  genericOptions: { xAxisLabelLength: v },
                })}
              />
            )}
          </>,
        )
      }
      {
        renderRow(null,
          <>
            {type === types.MAP &&
              renderToggle(
                'Legend',
                showLegend,
                v => userUpdate({ genericOptions: { showLegend: v } }),
              )
            }
            {type === types.MAP &&
              renderToggle(
                'Tooltip',
                showTooltip,
                v => userUpdate({ genericOptions: { showTooltip: v } }),
              )
            }
            {(type === types.MAP ||
              type === types.STAT) &&
              renderToggle(
                'Labels',
                showLabels,
                v => userUpdate({ genericOptions: { showLabels: v } }),
                JSON.stringify(renderableValueKeys)?.includes(MAP_VALUE_VIS.elevation)
              )
            }
            {type === types.STAT &&
              renderToggle(
                'Vertical',
                showVertical,
                v => userUpdate({ genericOptions: { showVertical: v } }),
              )
            }
            {[types.BAR, types.SCATTER, types.LINE].includes(type) &&
              renderToggle(
                'Subplots',
                subPlots,
                v => userUpdate({ genericOptions: { subPlots: v } }),
                renderableValueKeys?.length <= 1
              )
            }
            {[types.BAR, types.SCATTER, types.LINE, types.PIE].includes(type) &&
              renderToggle(
                'Subplot Titles',
                showSubPlotTitles,
                v => userUpdate({ genericOptions: { showSubPlotTitles: v } }),
                !(type === types.PIE || subPlots),
              )
            }
          </>
        )
      }
      {[types.BAR, types.SCATTER, types.LINE].includes(type) &&
      <>
        {renderRow(null,
          <>
            {
              renderToggle(
                'Show x-Axis Title',
                showAxisTitles.x,
                v => userUpdate({
                  genericOptions: {
                    showAxisTitles: { x: v },
                  },
                }),
              )
            }
            {
              renderToggle(
                'Show y-Axis Title',
                showAxisTitles.y,
                v => userUpdate({
                  genericOptions: {
                    showAxisTitles: { y: v },
                  },
                }),
                false
              )
            }
          </>,
        )}
        {renderRow(null,
          <>
            {renderItem('x-Axis Title',
              <TextField
                classes={textfieldClasses}
                value={showAxisTitles.x ? axisTitles.x : 'N/A'}
                inputProps={{ placeholder: 'Add x-axis custom title' }}
                onChange={(val) => userUpdate({ genericOptions: { axisTitles: { x: val } } })}
                maxLength={100}
                disabled={!showAxisTitles.x}
              />,
              '',
              true,
            )}
            {renderItem('y-Axis Title',
              <TextField
                classes={textfieldClasses}
                value={showAxisTitles.y ? axisTitles.y : 'N/A'}
                inputProps={{ placeholder: 'Add y-axis custom title' }}
                onChange={(val) => userUpdate({ genericOptions: { axisTitles: { y: val } } })}
                maxLength={100}
                disabled={!showAxisTitles.y}
              />,
              '',
              true,
            )}
          </>,
        )}
      </>
      }
    </>
  )

  const renderStyling = (
    <>
      {![types.MAP, types.STAT].includes(type) && renderItem('Title Position',
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
      {type !== types.STAT && renderItem('Legend Position',
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
      {type === types.STAT && renderItem('Label Position',
        <CustomSelect
          simple
          fullWidth
          data={['Top', 'Bottom']}
          value={labelPosition}
          onSelect={labelPosition => userUpdate({ genericOptions: { labelPosition } })}
          placeholder={!showLabels ? 'N/A' : 'Select'}
          disabled={!showLabels}
          allowClear={false}
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
      <MutedBarrier mute={!type ||
        ((type !== types.MAP || (type === types.MAP && !dataIsXWIReport)) &&
          (!domain?.value || !(renderableValueKeys?.length)))
      } >
        <Filters />
      </MutedBarrier>
      {type !== types.TABLE &&
        <MutedBarrier mute={(!type || !domain?.value || !(renderableValueKeys?.length)) && !isReady} >
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
        </MutedBarrier>
      }
      {![types.MAP, types.STAT, types.TABLE].includes(type) &&
        <WidgetControlCard title='Color Scheme'>
          <ColorSchemeControls />
        </WidgetControlCard >
      }
      {hasDevAccess &&
        <WidgetControlCard
          clear={() => userUpdate({
            subtitle: '',
            subtitleLinkLabel: '',
            subtitleHyperlink: '',
          })}
          title='Widget Title & Subtitle'
        >
          {renderSection(null,
            <>
              {
                renderToggle(
                  'Title',
                  showTitleBar,
                  v => userUpdate({ showTitleBar: v }),
                )
              }
              <EditableSubtitle />
            </>
          )}
        </WidgetControlCard>
      }
      <ExportControls />
    </EditorSidebarBase >
  )
}

export default EditorRightSidebar
