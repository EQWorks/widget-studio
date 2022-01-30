import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import { sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './components/color-scheme-controls'
import { makeStyles } from '@eqworks/lumen-labs'
import { renderItem, renderSection, renderRow, renderBool } from './util'
import UniqueOptionControls from './components/unique-option-controls'


const classes = makeStyles({
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
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
    <WidgetControlCard title='Options'>
      <div className={classes.outerContainer}>
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
                {showLegend && renderItem(
                  'Legend Position',
                  <XYSelect
                    value={legendPosition}
                    update={legendPosition => nestedUpdate({ genericOptions: { legendPosition } })}
                  />
                )}
                {renderItem(
                  'Title Position',
                  <XYSelect
                    value={titlePosition}
                    update={titlePosition => nestedUpdate({ genericOptions: { titlePosition } })}
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
      </div>
    </WidgetControlCard >
  )
}

export default EditorRightSidebar
