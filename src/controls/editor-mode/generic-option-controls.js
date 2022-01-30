import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import { sizes } from '../../constants/viz-options'
import types from '../../constants/types'
import CustomToggle from '../../components/custom-toggle'
import CustomSelect from '../../components/custom-select'
import XYSelect from '../../components/xy-select'
import ColorSchemeControls from './color-scheme-controls'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  section: {
    marginBottom: '0.6rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    color: getTailwindConfigColor('secondary-800'),
    fontWeight: 700,
    fontSize: '0.8rem',
    marginBottom: '0.4rem',
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    margin: '0.2rem 0',
  },
  inlineItemContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0.2rem',
  },
  inlineItem: {
  },
  item: {
    display: 'flex',
  },
  inlineTitle: {
    color: getTailwindConfigColor('secondary-500'),
    fontSize: '0.8rem',
    marginLeft: '0.4rem',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: getTailwindConfigColor('secondary-500'),
    fontSize: '0.8rem',
    marginBottom: '0.2rem',
    display: 'flex',
    alignItems: 'center',
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

  const renderSection = (title, Component) => (
    <div className={classes.section}>
      {title && <div className={classes.sectionTitle}> {`${title}:`} </div>}
      {Component}
    </div>
  )

  const renderRow = (title, Component) => (
    <>
      {title && <div className={classes.title} > {`${title}:`} </div>}
      <div className={classes.row}>
        {Component}
      </div>
    </>
  )
  const renderItem = (title, Component) => (
    <div className={classes.itemContainer}>
      <div className={classes.title} > {`${title}:`} </div>
      <div className={classes.item}>
        {Component}
      </div>
    </div>
  )

  const renderBool = (title, value, disabled = false) => {
    const [k, v] = Object.entries(value)[0]
    return <div className={classes.inlineItemContainer}>
      <div className={classes.inlineItem}>
        <CustomToggle
          value={v}
          onChange={(val) => nestedUpdate({ genericOptions: { [k]: val } })}
          disabled={disabled}
        />
      </div>
      {title && <div className={classes.inlineTitle} > {`${title}`} </div>}
    </div>
  }

  return (
    <WidgetControlCard title='Options'>
      <div className={classes.outerContainer}>
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
                {renderBool('Legend', { showLegend })}
                {type !== 'pie' && renderBool('Subplots', { subPlots }, valueKeys.length <= 1)}
              </>
            )}
            {renderRow(null,
              <>
                {renderItem(
                  'Size',
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

export default GenericOptionControls
