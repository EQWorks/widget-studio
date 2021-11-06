import React from 'react'

import { aggFuncDict } from '../../../../view/adapter'
import { useStoreState, useStoreActions } from '../../../../store'
import CustomSelect from '../../../shared-components/custom-select'
import MapLinkedSelect from './map-linked-select'
import WidgetControlCard from '../../../shared-components/widget-control-card'
import { MAP_LAYER_VIS, MAP_LAYER_GEO_KEYS } from '../../../../constants/map'


const MapValueControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)

  // restrict selection list for mapGroupKey to only valid map geo keysq
  const mapGeoKeys = Object.values(MAP_LAYER_GEO_KEYS).reduce((agg, val) => [...agg, ...val], [])
  const mapGroupByKeys = stringColumns.filter(val => mapGeoKeys.includes(val))
  const mapLayer = Object.keys(MAP_LAYER_VIS).filter(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))[0]

  return (
    <>
      <WidgetControlCard title='Group by' >
        <CustomSelect
          data={mapGroupByKeys}
          value={mapGroupKey}
          setChosenValue={val => update({ mapGroupKey: val })}
        />
      </WidgetControlCard>
      <WidgetControlCard title='Value keys' >
        <MapLinkedSelect
          categories={MAP_LAYER_VIS[mapLayer]}
          values={mapValueKeys}
          data={numericColumns}
          subData={mapGroupKey ? Object.keys(aggFuncDict) : []}
          update={(val) => nestedUpdate({ mapValueKeys: val })}
          callback={(i, val) => {
            if (i === -1) { // add a key
              const valueKeysCopy = JSON.parse(JSON.stringify(mapValueKeys))
              valueKeysCopy.push(val)
              update({ mapValueKeys: valueKeysCopy })
            } else { // modify a key
              update({ mapValueKeys: mapValueKeys.map((v, _i) => i === _i ? val : v) })
            }
          }}
          deleteCallback={(i) => {
            const valueKeysCopy = JSON.parse(JSON.stringify(mapValueKeys))
            valueKeysCopy.splice(i, 1)
            update({ mapValueKeys: valueKeysCopy })
          }}
        />
      </WidgetControlCard>
    </>
  )
}

export default MapValueControls
