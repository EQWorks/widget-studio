import React from 'react'

import aggFunctions from '../../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import MapLinkedSelect from './map-linked-select'
import WidgetControlCard from '../widget-control-card'

import modes from '../../../constants/modes'
import { MAP_LAYER_VIS, MAP_LAYER_GEO_KEYS, COORD_KEYS } from '../../../constants/map'


const MAP_GEO_KEYS = Object.values(MAP_LAYER_GEO_KEYS).reduce((agg, val) => [...agg, ...val], [])

const MapValueControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)

  // common state
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)
  const zeroVarianceColumns = useStoreState((state) => state.zeroVarianceColumns)

  // restrict selection list for mapGroupKey to only valid map geo keysq
  const mapGroupByKeys = stringColumns.filter(val => MAP_GEO_KEYS.includes(val) )
  const mapLayer = Object.keys(MAP_LAYER_VIS).find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
  const mapNumericColumns = numericColumns.filter(col => !Object.values(COORD_KEYS).flat().includes(col))

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  return (
    <>
      <WidgetControlCard
        title='Group by' >
        <CustomSelect
          data={mapGroupByKeys}
          value={mapGroupKey}
          onSelect={val => update({ mapGroupKey: val })}
          placeholder='Select a column to group by'
        />
      </WidgetControlCard>
      {/* we don't render controls for map widget until we know which mapGroupKey we use,
        which determines the mapLayer and, finally, the map layer controls */}
      {mapGroupKey &&
        <WidgetControlCard
          grow
          clearable
          title='Key(s) Configuration'
          description={mode === modes.QL ? 'Select key values, open in editor for more options.' : ''}
        >
          <MapLinkedSelect
            categories={MAP_LAYER_VIS[mapLayer]}
            titles={['Key', 'Aggregation']}
            values={mapValueKeys}
            data={mapNumericColumns}
            subData={mapGroupKey ? Object.keys(aggFunctions) : []}
            disableSubFor={zeroVarianceColumns}
            disableSubMessage="doesn't require aggregation."
            callback={(i, val) => {
              if (i === -1) {
                const valueKeysCopy = JSON.parse(JSON.stringify(mapValueKeys))
                valueKeysCopy.push(val)
                update({ mapValueKeys: valueKeysCopy })
              } else { // modify a key
                update({ mapValueKeys: mapValueKeys.map((v, _i) => i === _i ? val : v) })
              }
            }}
          />
        </WidgetControlCard>
      }
    </>
  )
}

export default MapValueControls
