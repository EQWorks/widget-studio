import React from 'react'

import { TextField, Icons } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow, renderItem } from './util'
import { setMapValueKeys } from '../../util/map-layer-value-functions'
import { hasDevAccess } from '../../util/access'
import { MAP_LAYERS, MAP_LAYER_GEO_KEYS } from '../../constants/map'


const textfieldClasses = Object.freeze({
  container: 'mt-0.5',
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
      placeholder={'Select a column to group by'}
    />
  ))

  const renderAlias = renderItem('Alias', (
    <TextField
      classes={textfieldClasses}
      size={'md'}
      // value={showAxisTitles.y ? axisTitles.y : 'N/A'}
      inputProps={{ placeholder: 'Column title alias' }}
      // onChange={(val) => userUpdate({ genericOptions: { axisTitles: { y: val } } })}
      // maxLength={100}
      disabled={!domain.value}
    />
  ))

  return (
    <WidgetControlCard
      title={'Map Layer Configuration'}
      enableEdit={hasDevAccess() && domain.value}
    >
      {renderRow('',
        <>
          {renderControls}
          {widgetControlCardEdit && renderAlias}
        </>
      )}
    </WidgetControlCard>
  )
}

export default MapDomainControls
