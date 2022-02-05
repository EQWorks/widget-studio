import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './components/color-scheme-controls'
import { renderItem, renderSection, renderRow, renderBool } from './util'
import UniqueOptionControls from './components/unique-option-controls'
import EditorSidebarBase from './sidebar-base'
import Filters from './filters'


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
      <WidgetControlCard title='Options'>
        {renderSection(
          null,
          subPlots && renderItem(
            'Subplot Spacing',
            <CustomSelect
              fullWidth
              data={sizes.string}
              value={sizes.string[sizes.numeric.indexOf(size)]}
              onSelect={v => nestedUpdate({ genericOptions: { size: sizes.dict[v] } })}
            />
          )
        )}
        {type !== types.MAP &&
          renderSection(
            null,
            renderRow(
              null,
              <>
                {renderItem(
                  'Title Position',
                  <XYSelect
                    value={titlePosition}
                    update={titlePosition => nestedUpdate({ genericOptions: { titlePosition } })}
                  />
                )}
                {showLegend && renderItem(
                  'Legend Position',
                  <XYSelect
                    value={legendPosition}
                    update={legendPosition => nestedUpdate({ genericOptions: { legendPosition } })}
                  />
                )}
              </>
            )
          )}
        {renderSection(
          'Display Options',
          <>
            {renderRow(null,
              <>
                {renderBool(
                  'Legend',
                  showLegend,
                  v => nestedUpdate({ genericOptions: { showLegend: v } }),
                )}
                {type !== types.PIE && type !== types.MAP &&
                  renderBool(
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
        {renderSection(
          'Colour Scheme',
          <ColorSchemeControls />
        )}
      </WidgetControlCard >
    </EditorSidebarBase >
  )
}

export default EditorRightSidebar
