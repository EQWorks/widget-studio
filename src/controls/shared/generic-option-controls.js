import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import { sizes, positions } from '../../constants/viz-options'
import CustomToggle from '../../components/custom-toggle'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './color-scheme-controls'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  controlRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  controlSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  controlSectionTitle: {
    color: getTailwindConfigColor('secondary-500'),
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  fullWidth: {
    width: '100%',
  },
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
})

const GenericOptionControls = () => {

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

  const renderItem = (title, Component) => (
    <div className={classes.controlSection}>
      <div className={classes.controlSectionTitle} > {`${title}:`} </div>
      <div className={classes.fullWidth}> {Component} </div>
    </div>
  )

  return (
    <WidgetControlCard title='Options'>
      <div className={classes.outerContainer}>
        {
          renderItem(
            'Show legend',
            <CustomToggle
              value={showLegend}
              onChange={(val) => nestedUpdate({ genericOptions: { showLegend: val } })}
            />
          )
        }
        {
          type !== 'pie' &&
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
        {
          subPlots &&
          renderItem(
            'Title position',
            <CustomSelect
              data={positions.string}
              value={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(titlePosition))]}
              onSelect={v => nestedUpdate({ genericOptions: { titlePosition: positions.dict[v] } })}
            />
          )
        }

        <div className={classes.controlRow}>
          {
            renderItem(
              'Legend Position',
              <XYSelect
                value={legendPosition}
                update={legendPosition => nestedUpdate({ genericOptions: { legendPosition } })}
              />
            )
          }
          {
            renderItem(
              'Title Position',
              <XYSelect
                value={titlePosition}
                update={titlePosition => nestedUpdate({ genericOptions: { titlePosition } })}
              />
            )
          }
        </div>
        {
          renderItem(
            'Colour Scheme',
            <ColorSchemeControls />
          )
        }
      </div>
    </WidgetControlCard>
  )
}

export default GenericOptionControls
