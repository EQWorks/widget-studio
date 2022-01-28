import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import { sizes, positions } from '../../constants/viz-options'
import CustomToggle from '../../components/custom-toggle'
import CustomSelect from '../../components/custom-select'
import ColorSchemeControls from './color-scheme-controls'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const styles = makeStyles({
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
    <div className={styles.controlSection}>
      <div className={styles.controlSectionTitle} > {`${title}:`} </div>
      <div className={styles.fullWidth}> {Component} </div>
    </div>
  )

  return (
    <WidgetControlCard title='Options'>
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
      {
        showLegend &&
          renderItem(
            'Legend position',
            <CustomSelect
              data={positions.string.filter(s => positions.dict[s].every(n => n === 0 || n === 1))} // only include corners
              value={positions.string[positions.numeric.map(JSON.stringify).indexOf(JSON.stringify(legendPosition))]}
              onSelect={v => nestedUpdate({ genericOptions: { legendPosition: positions.dict[v] } })}
            />
          )
      }
      {
        renderItem(
          'Colour Scheme',
          <ColorSchemeControls />
        )
      }
    </WidgetControlCard>
  )
}

export default GenericOptionControls
