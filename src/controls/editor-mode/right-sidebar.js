import React, { useEffect, useMemo } from 'react'

import { TextField, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import MutedBarrier from '../shared/muted-barrier'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './components/color-scheme-controls'
import UniqueOptionControls from './components/unique-option-controls'
import EditorSidebarBase from './sidebar-base'
import MapLayerDisplay from './map-layer-display'
import Filters from './components/filters'
import CustomDropdown from './components/custom-dropdown'
import ExportControls from './components/export-controls'
import SliderControl from './components/slider-control'
import EditableSubtitle from '../../view/title-bar/editable-subtitle'
import ColumnAliasControls from '../editor-mode/components/column-alias-controls'
import { hasDevAccess  } from '../../util/access'
import { renderItem, renderSection, renderRow, renderToggle, renderSuperSection } from '../shared/util'
import { positions, sizes, CHART_Z_POSITIONS } from '../../constants/viz-options'
import types from '../../constants/types'
import cardTypes from '../../constants/card-types'
import { MAP_LEGEND_SIZE, MAP_VALUE_VIS } from '../../constants/map'


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
  const columnNameAliases = useStoreState((state) => state.columnNameAliases)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  const domain = useStoreState((state) => state.domain)
  const enableLocationPins = useStoreState((state) => state.enableLocationPins)
  const formattedColumnNames = useStoreState((state) => state.formattedColumnNames)
  const isReady = useStoreState((state) => state.isReady)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const showTitleBar = useStoreState((state) => state.showTitleBar)
  const type = useStoreState((state) => state.type)
  const update = useStoreActions((state) => state.update)
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)
  const { sharedYAxis } = useStoreState((state) => state.uniqueOptions)

  const {
    axisTitles,
    chart1ZPosition,
    labelPosition,
    legendPosition,
    legendSize,
    mapPinTooltipKey,
    showAxisTitles,
    showCurrency,
    showLabels,
    showLegend,
    showLocationPins,
    showSubPlotTitles,
    showTooltip,
    showVertical,
    showWidgetTitle,
    size,
    subPlots,
    titlePosition,
    xAxisLabelLength,
  } = useStoreState((state) => state.genericOptions)

  useEffect(() => {
    if (renderableValueKeys?.length <= 1) {
      update({ genericOptions: { subPlots: false } })
    }
  }, [renderableValueKeys?.length, update])

  // update mapPinTooltipKey.title if alias changes
  useEffect(() => {
    if (mapPinTooltipKey?.key && mapPinTooltipKey.title !== formattedColumnNames[mapPinTooltipKey.key]) {
      update({
        genericOptions: {
          mapPinTooltipKey: {
            title: formattedColumnNames[mapPinTooltipKey.key],
          },
        },
      })
    }
  }, [mapPinTooltipKey, formattedColumnNames, update])

  const eligibleTooltipKeys = useMemo(() => (
    Object.fromEntries(
      Object.entries(columnsAnalysis)
        .filter(([, { isNumeric }]) => !isNumeric)
        .map(([c, { Icon }]) => [c, { Icon }])
    )
  ), [columnsAnalysis])

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
            {![types.STAT, types.TABLE].includes(type) &&
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
            {(type === types.MAP || type === types.STAT) &&
              renderToggle(
                'Labels',
                showLabels,
                v => userUpdate({ genericOptions: { showLabels: v } }),
                JSON.stringify(renderableValueKeys)?.includes(MAP_VALUE_VIS.elevation)
              )
            }
            {type === types.MAP && enableLocationPins &&
              renderToggle(
                'Location Pins',
                showLocationPins,
                v => userUpdate({ genericOptions: { showLocationPins: v } }),
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
      {type === types.MAP && enableLocationPins && renderRow(null,
        <>
          {
            renderItem('Pin Tooltip Key',
              <CustomSelect
                fullWidth
                data={Object.keys(eligibleTooltipKeys)}
                icons={Object.values(eligibleTooltipKeys).map(({ Icon }) => Icon)}
                value={mapPinTooltipKey?.key}
                onSelect={val => userUpdate({
                  genericOptions: {
                    mapPinTooltipKey: {
                      key: val,
                      title: formattedColumnNames[val],
                    },
                  },
                })}
                onClear={() => userUpdate({
                  genericOptions: {
                    mapPinTooltipKey: null,
                  },
                })}
                placeholder='Select column'
                disabled={!showLocationPins}
              />,
            )
          }
          {widgetControlCardEdit[cardTypes.RIGHT_SIDEBAR] &&
            renderItem('Pin Tooltip Key Alias',
              <ColumnAliasControls
                value={mapPinTooltipKey?.key || ''}
                disabled={!hasDevAccess() || !mapPinTooltipKey?.key }
              />
            )
          }
        </>,
      )}
      {[types.BAR, types.SCATTER, types.LINE, types.PYRAMID, types.BARLINE].includes(type) &&
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
              {type === types.BARLINE &&
                renderToggle(
                  'Show y2-Axis Title',
                  showAxisTitles.y2,
                  v => userUpdate({
                    genericOptions: {
                      showAxisTitles: { y2: v },
                    },
                  }),
                  sharedYAxis,
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
                  inputProps={{ placeholder: 'Custom title' }}
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
                  inputProps={{ placeholder: 'Custom title' }}
                  onChange={(val) => userUpdate({ genericOptions: { axisTitles: { y: val } } })}
                  maxLength={100}
                  disabled={!showAxisTitles.y}
                />,
                '',
                true,
              )}
              {type === types.BARLINE && renderItem('y2-Axis Title',
                <TextField
                  classes={textfieldClasses}
                  value={showAxisTitles.y2 ? axisTitles.y2 : 'N/A'}
                  inputProps={{ placeholder: 'Custom title' }}
                  onChange={(val) => userUpdate({ genericOptions: { axisTitles: { y2: val } } })}
                  maxLength={100}
                  disabled={!showAxisTitles.y2 || sharedYAxis}
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
    <>
      {[types.LINE, types.BAR, types.PIE, types.SCATTER].includes(type) && renderItem('Subplot Size',
        <CustomSelect
          fullWidth
          allowClear={false}
          data={sizes.string}
          value={sizes.string[sizes.numeric.indexOf(size)]}
          onSelect={v => userUpdate({ genericOptions: { size: sizes.dict[v] } })}
          disabled={!subPlots}
        />,
      )}
      {type === types.BARLINE && renderItem('Bar Position',
        <CustomSelect
          simple
          fullWidth
          data={Object.values(CHART_Z_POSITIONS)}
          value={chart1ZPosition}
          onSelect={chart1ZPosition => userUpdate({ genericOptions: { chart1ZPosition } })}
          placeholder={'Select'}
          disabled={!renderableValueKeys.filter(el => !el.type) || sharedYAxis}
          allowClear={false}
        />,
      )}
    </>
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
          <WidgetControlCard
            title={type === types.MAP ? 'Map Settings' : 'Chart Settings'}
            enableEdit={hasDevAccess() && type === types.MAP && enableLocationPins}
            disableEditButton={type !== types.MAP || !mapPinTooltipKey?.key}
            type={cardTypes.RIGHT_SIDEBAR}
            {...(hasDevAccess() && type === types.MAP && enableLocationPins && {
              clear: () => {
                Object.keys(columnNameAliases).forEach(key => {
                  if (mapPinTooltipKey?.key === key) {
                    delete columnNameAliases[key]
                  }
                })
                userUpdate({
                  aliasesReseted: true,
                  columnNameAliases,
                  genericOptions: {
                    mapPinTooltipKey: null,
                  },
                })
              },
            })}
          >
            {
              renderSuperSection(
                <>
                  {renderSection(
                    'Display Options',
                    <>
                      {renderGenericOptions}
                      {type !== types.MAP && <UniqueOptionControls type={type} />}
                    </>
                  )}
                  {renderSection('Styling',
                    <>
                      {renderRow(null, renderStyling)}
                      {[types.LINE, types.BAR, types.SCATTER, types.PIE, types.BARLINE].includes(type)
                        && renderRow(null, renderStylingSecondRow)}
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
