import React from 'react'

import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { positions, sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './components/color-scheme-controls'
import { renderItem, renderSection, renderRow, renderToggle } from './util'
import UniqueOptionControls from './components/unique-option-controls'
import EditorSidebarBase from './sidebar-base'
import Filters from './filters'
import CustomDropdown from './components/custom-dropdown'


const classes = makeStyles({
  xyDropdownMenu: {
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const EditorRightSidebar = () => {
  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const type = useStoreState((state) => state.type)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)
  const size = useStoreState((state) => state.genericOptions.size)
  const titlePosition = useStoreState((state) => state.genericOptions.titlePosition)
  const legendPosition = useStoreState((state) => state.genericOptions.legendPosition)
  const showLegend = useStoreState((state) => state.genericOptions.showLegend)

  return (
    <EditorSidebarBase>
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
                    >
                      <XYSelect
                        value={titlePosition}
                        disabled={[[0.5, 0.5], [0, 0.5], [1, 0.5]]}
                        update={titlePosition => nestedUpdate({ genericOptions: { titlePosition } })}
                      />
                    </CustomDropdown>
                  )}
                  {showLegend && renderItem('Legend Position',
                    <CustomDropdown
                      selectedString={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(legendPosition))]}
                      classes={{ menu: classes.xyDropdownMenu }}
                    >
                      <XYSelect
                        value={legendPosition}
                        update={legendPosition => nestedUpdate({ genericOptions: { legendPosition } })}
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
                  onSelect={v => nestedUpdate({ genericOptions: { size: sizes.dict[v] } })}
                />
              )}
            </>
          )
        }
        {renderSection(
          'Display Options',
          <>
            {renderRow(null,
              <>
                {renderToggle(
                  'Legend',
                  showLegend,
                  v => nestedUpdate({ genericOptions: { showLegend: v } }),
                )}
                {type !== types.PIE && type !== types.MAP &&
                  renderToggle(
                    'Subplots',
                    subPlots,
                    v => nestedUpdate({ genericOptions: { subPlots: v } }),
                    valueKeys.length <= 1
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
    </EditorSidebarBase >
  )
}

export default EditorRightSidebar
