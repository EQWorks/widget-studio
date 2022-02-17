import React, { useMemo } from 'react'

import { useStoreState, useStoreActions } from '../../store'
import CustomSelect from '../../components/custom-select'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderRow } from './util'
import { MAP_LAYER_VALUE_VIS, MAP_LAYER_GEO_KEYS } from '../../constants/map'
import { Icons } from '@eqworks/lumen-labs'


const MapDomainControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const userUpdate = useStoreActions(actions => actions.userUpdate)

  // common state
  const columns = useStoreState((state) => state.columns)
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const domain = useStoreState((state) => state.domain)

  const eligibleDomainValues = useMemo(() => (
    columns.map(({ name }) => name)
      .filter(c =>
        !(valueKeys.map(({ key }) => key).includes(c))
        && validMapGroupKeys.includes(c)
      )
  ), [columns, validMapGroupKeys, valueKeys])

  const mapLayer = useMemo(() => (
    Object.keys(MAP_LAYER_VALUE_VIS)
      .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
  ), [mapGroupKey])

  const renderControls = (
    <CustomSelect
      fullWidth
      data={eligibleDomainValues}
      icons={eligibleDomainValues.map(() => Icons.AddPin)}
      value={domain.value}
      onSelect={val => {
        // update groupKey with mapGroupKey value to have it available if we switch to a chart widget type
        userUpdate({ mapGroupKey: val, groupKey: val })
        const newLayer = Object.keys(MAP_LAYER_VALUE_VIS)
          .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(val))
        /*
                 * reset mapValueKeys when we change to a mapGroupKey that requires a different layer,
                 * as different layer requires different visualization types
                 */
        if (newLayer !== mapLayer) {
          update({ mapValueKeys: [] })
        }
      }}
      onClear={() => userUpdate({
        groupKey: null,
        indexKey: null,
        mapGroupKey: null,
        mapValueKeys: [],
      })}
      placeholder={'Select a column to group by'}
    />
  )

  return (
    <WidgetControlCard title={'Map Layer Configuration'}>
      {renderRow('Column', renderControls)}
    </WidgetControlCard>
  )
}

export default MapDomainControls
