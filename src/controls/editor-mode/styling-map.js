import React from 'react'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { positions, sizes } from '../../constants/viz-options'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import { renderItem, renderSection, renderRow } from '../shared/util'
import UniqueOptionControls from './components/unique-option-controls'
import CustomDropdown from './components/custom-dropdown'


const classes = makeStyles({
  xyDropdownMenu: {
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning: {
    background: getTailwindConfigColor('secondary-200'),
    color: getTailwindConfigColor('secondary-600'),
    borderRadius: '0.7rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    margin: '1rem',
    padding: '2rem 1rem',
    lineHeight: '1.4rem',
  },
})

const StylingMap = () => {
  // common actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // common state
  const type = useStoreState((state) => state.type)
  const subPlots = useStoreState((state) => state.genericOptions.subPlots)
  const size = useStoreState((state) => state.genericOptions.size)
  const legendPosition = useStoreState((state) => state.genericOptions.legendPosition)
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
