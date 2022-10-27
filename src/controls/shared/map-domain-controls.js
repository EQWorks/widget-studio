import React from 'react'

import { Icons } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import ColumnAliasControls from '../editor-mode/components/column-alias-controls'
import { renderRow, renderItem } from './util'
import { setMapValueKeys } from '../../util/map-layer-value-functions'
import { hasDevAccess } from '../../util/access'
import cardTypes from '../../constants/card-types'
import { MAP_LAYERS, MAP_LAYER_GEO_KEYS } from '../../constants/map'


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
    <ColumnAliasControls
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
    >
      {renderRow('',
        <>
          {renderControls}
          {widgetControlCardEdit[cardTypes.DOMAIN] && renderAlias}
        </>
      )}
    </WidgetControlCard>
  )
}

export default MapDomainControls
