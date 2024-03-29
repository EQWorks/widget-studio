import React from 'react'

import { Icons, Tooltip, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import ColumnNameAlias from '../editor-mode/components/column-name-alias'
import { renderRow, renderItem, renderToggle } from './util'
import { setMapValueKeys } from '../../util/map-layer-value-functions'
import { hasDevAccess } from '../../util/access'
import cardTypes from '../../constants/card-types'
import { MAP_LAYERS, MAP_LAYER_GEO_KEYS, GEO_KEY_TYPES } from '../../constants/map'


const classes = makeStyles({
  toggle: {
    marginTop: '0.7rem',
  },
})

const MapDomainControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)

  // common state
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const domain = useStoreState((state) => state.domain)
  const mapLayer = useStoreState((state) => state.mapLayer)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)
  const showMVTOption = useStoreState((state) => state.showMVTOption)
  const useMVTOption = useStoreState((state) => state.useMVTOption)
  const groupFSAByPC = useStoreState((state) => state.groupFSAByPC)

  const renderControls = renderItem('Column', (
    <CustomSelect
      fullWidth
      data={validMapGroupKeys}
      icons={validMapGroupKeys.map(() => Icons.AddPin)}
      value={domain.value}
      onSelect={val => {
        // update groupKey with mapGroupKey value to have it available if we switch to a chart widget type
        userUpdate({ mapGroupKey: val, groupKey: val })
        const newLayer = Object.keys(MAP_LAYERS)
          .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(val))
        /*
        * reset mapValueKeys when we change to a mapGroupKey that requires a different layer,
        * as different layer requires different visualization types
        */
        if (newLayer !== mapLayer) {
          update({ mapValueKeys: setMapValueKeys({ mapLayer, dataIsXWIReport }) || [] })
        }
      }}
      onClear={() => userUpdate({
        groupKey: null,
        indexKey: null,
        mapGroupKey: null,
        mapValueKeys: setMapValueKeys({ mapLayer, dataIsXWIReport }) || [],
      })}
      placeholder={'Select column'}
    />
  ))

  const renderAlias = renderItem('Alias', (
    <ColumnNameAlias
      value={domain.value || ''}
      disabled={hasDevAccess() && !domain.value}
    />
  ))

  return (
    <WidgetControlCard
      title={'Map Layer Configuration'}
      enableEdit={hasDevAccess()}
      disableEditButton={!(domain.value || widgetControlCardEdit[cardTypes.DOMAIN])}
      type={cardTypes.DOMAIN}
      clear={() => userUpdate({
        aliasesReseted: true,
        columnNameAliases: {},
        groupKey: null,
        indexKey: null,
        mapGroupKey: null,
        mapValueKeys: setMapValueKeys({ mapLayer, dataIsXWIReport }) || [],
      })}
    >
      {renderRow('',
        <>
          {renderControls}
          {widgetControlCardEdit[cardTypes.DOMAIN] && renderAlias}
        </>
      )}
      {/* toggle for MVT or geojson geom render for postal codes */}
      {hasDevAccess() && showMVTOption && renderRow('',
        <div className={classes.toggle}>
          {renderToggle(
            'Use MVT Render',
            useMVTOption,
            v => userUpdate({ useMVTOption: v }),
            (groupFSAByPC && GEO_KEY_TYPES.fsa.includes(domain.value) ||
            GEO_KEY_TYPES.region.includes(domain.value)),
            <Tooltip
              description='Choose MVT Render for very large sets of polygons.'
              width='10.5rem'
              arrow={false}
              position='right'
              classes={{ content: 'overflow-y-visible' }}
            >
              <Icons.AlertInformation
                size='sm'
                color={getTailwindConfigColor('secondary-500')}
              />
            </Tooltip>
          )}
        </div>,
      )}
    </WidgetControlCard>
  )
}

export default MapDomainControls
