import React from 'react'

import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { positions } from '../../constants/viz-options'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import { renderItem, renderSection, renderRow } from '../shared/util'
import UniqueOptionControls from './components/unique-option-controls'
import CustomDropdown from './components/custom-dropdown'
import { MAP_LEGEND_SIZE } from '../../constants/map'


const classes = makeStyles({
  xyDropdownMenu: {
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const StylingMap = () => {
  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const type = useStoreState((state) => state.type)
  const legendPosition = useStoreState((state) => state.genericOptions.legendPosition)
  const legendSize = useStoreState((state) => state.genericOptions.legendSize)
  const showLegend = useStoreState((state) => state.uniqueOptions.showLegend)

  return (
    <WidgetControlCard title='Styling'>
      {renderSection(null,
        <>
          {renderRow(null,
            <>
              {renderItem('Legend Position',
                <CustomDropdown
                  disabled={!showLegend}
                  selectedString={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(legendPosition))]}
                  classes={{ menu: classes.xyDropdownMenu }}
                >
                  <XYSelect
                    value={legendPosition}
                    update={legendPosition => nestedUpdate({ genericOptions: { legendPosition } })}
                    disabled={[[0.5, 0.5], [0, 0.5], [1, 0.5]]}
                  />
                </CustomDropdown>
              )}
              {renderItem('Legend Size',
                <CustomSelect
                  allowClear={false}
                  disabled={!showLegend}
                  fullWidth
                  data={Object.keys(MAP_LEGEND_SIZE)}
                  value={legendSize}
                  onSelect={legendSize => nestedUpdate({ genericOptions: { legendSize } })}
                />
              )}
            </>
          )}
        </>
      )}
      {renderSection(
        'Display Options',
        <>
          <UniqueOptionControls type={type} />
        </>
      )}
    </WidgetControlCard >
  )
}

export default StylingMap
