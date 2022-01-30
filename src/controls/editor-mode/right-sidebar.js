import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import { sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomToggle from '../../components/custom-toggle'
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
        <UniqueOptionControls type={type} />
        {
          type !== types.PIE &&
          renderItem(
            'Subplots',
            <CustomToggle
              value={subPlots}
              onChange={(val) => nestedUpdate({ genericOptions: { subPlots: val } })}
              disabled={valueKeys.length <= 1}
            />
          )
        }
        {
          renderItem(
            'Size',
            <CustomSelect
              data={sizes.string}
              value={sizes.string[sizes.numeric.indexOf(size)]}
              onSelect={v => nestedUpdate({ genericOptions: { size: sizes.dict[v] } })}
            />
          )
        }
        {renderSection(
          null,
          renderRow(
            null,
            <>
              {renderItem(
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
          'Display Style',
          <>
            {renderRow(null,
              <>
                {
                  renderBool(
                    'Legend',
                    showLegend,
                    v => nestedUpdate({ genericOptions: { showLegend: v } }),
                  )
                }
                {
                  type !== types.PIE && type !== types.MAP &&
                  renderBool(
                    'Subplots',
                    subPlots,
                    v => nestedUpdate({ genericOptions: { subPlots: v } }),
                    valueKeys.length <= 1
                  )
                }
              </>
            )}
            {renderRow(null,
              <>
                {subPlots && renderItem(
                  'Subplot Spacing',
                  <CustomSelect
                    fullWidth
                    data={sizes.string}
                    value={sizes.string[sizes.numeric.indexOf(size)]}
                    onSelect={v => nestedUpdate({ genericOptions: { size: sizes.dict[v] } })}
                  />
                )}
                {renderItem(
                  'Another Dropdown',
                  <CustomSelect
                    fullWidth
                    data={sizes.string}
                    value={sizes.string[sizes.numeric.indexOf(size)]}
                    onSelect={v => nestedUpdate({ genericOptions: { size: sizes.dict[v] } })}
                  />
                )}
              </>)}
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
