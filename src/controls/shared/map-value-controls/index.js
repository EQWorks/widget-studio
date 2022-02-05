import React, { useMemo } from 'react'

import aggFunctions from '../../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import MapLinkedSelect from './map-linked-select'
import WidgetControlCard from '../widget-control-card'

import modes from '../../../constants/modes'
import { MAP_LAYER_VIS, MAP_LAYER_GEO_KEYS, COORD_KEYS, ID_KEYS } from '../../../constants/map'


const MapValueControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)

  // common state
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)

  const mapLayer = useMemo(() => Object.keys(MAP_LAYER_VIS)
    .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
  , [mapGroupKey])

  const mapNumericColumns = useMemo(() => numericColumns.filter(col =>
    !Object.values(COORD_KEYS).flat().includes(col) &&
    !ID_KEYS.includes(col))
  , [numericColumns])

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const widgetControlCardDescription = useMemo(() => {
    if (!mapGroupKey) {
      return (
        <>
          <p>Please select a column to group by above to enable</p>
          <p>key(s) configurations.</p>
        </>
      )
    }
    if (mode === modes.QL) {
      return 'Select key values, open in editor for more options.'
    }
    return ''
  }, [mapGroupKey, mode])

  return (
    <>
      <WidgetControlCard
        title='Domain Configuration' >
        <CustomSelect
          data={validMapGroupKeys}
          value={mapGroupKey}
          onSelect={val => {
            /* update groupKey with mapGroupKey value to have it available if we switch to
             * a chart widget type
             */
            update({ mapGroupKey: val, groupKey: val })
            const newLayer = Object.keys(MAP_LAYER_VIS)
              .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(val))
            /* reset mapValueKeys when we change to a mapGroupKey that requires a different layer,
             * as different layer requires different visualization types
             */
            if (newLayer !== mapLayer) {
              update({ mapValueKeys: [] })
            }
          }}
          onClear={() => update({ mapGroupKey: null, groupKey: null, mapValueKeys: [] })}
          placeholder='Select a column to group by'
        />
      </WidgetControlCard>
      <WidgetControlCard
        clearable
        showIfEmpty
        title='Value Configuration'
        description={widgetControlCardDescription}
      >
        {mapLayer &&
          <MapLinkedSelect
            categories={MAP_LAYER_VIS[mapLayer]}
            titles={['Column', 'Operation']}
            values={mapValueKeys}
            data={mapNumericColumns}
            subData={mapGroupKey ? Object.keys(aggFunctions) : []}
            disableSubs={!dataHasVariance}
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
        }
      </WidgetControlCard>
    </>
  )
}

export default MapValueControls
