import React, { useMemo } from 'react'

import aggFunctions from '../../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../../store'
import MapValueSelect from './map-value-select'
import XWIReportValueControls from './xwi-report-value-controls'
import WidgetControlCard from '../components/widget-control-card'

import modes from '../../../constants/modes'
import { MAP_LAYER_VALUE_VIS, MAP_LAYER_GEO_KEYS, COORD_KEYS, ID_KEYS } from '../../../constants/map'


const MapValueControls = () => {
  // common actions
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const resetValue = useStoreActions(actions => actions.resetValue)

  // common state
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)

  const mapLayer = useMemo(() => Object.keys(MAP_LAYER_VALUE_VIS)
    .find(layer => MAP_LAYER_GEO_KEYS[layer].includes(mapGroupKey))
  , [mapGroupKey])

  const mapNumericColumns = useMemo(() => (
    numericColumns.filter(col =>
      !Object.values(COORD_KEYS).flat().includes(col) &&
      !ID_KEYS.includes(col))
  ), [numericColumns])

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const widgetControlCardDescription = useMemo(() => {
    if (!mapGroupKey && !dataIsXWIReport) {
      return 'Please select a column to group by above to enable value configurations.'
    }
    if (mode === modes.QL && !dataIsXWIReport) {
      return 'Select key values, open in editor for more options.'
    }
    if (dataIsXWIReport) {
      return mode === modes.QL ?
        (
          <>
            <p>Please expand any layer sections below and select</p>
            <p>data columns for your choice of data visualization.</p>
          </>
        ) :
        'Please expand any layer sections below and select data columns for your choice of data visualization.'
    }
    return ''
  }, [mapGroupKey, dataIsXWIReport, mode])

  return (
    <WidgetControlCard
      clear={() => resetValue({ mapValueKeys })}
      showIfEmpty
      title='Value Configuration'
      description={widgetControlCardDescription}
    >
      {dataIsXWIReport ?
        (
          <XWIReportValueControls />
        ) :
        (mapLayer &&
          <MapValueSelect
            categories={MAP_LAYER_VALUE_VIS[mapLayer]}
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
                userUpdate({ mapValueKeys: valueKeysCopy })
              } else { // modify a key
                userUpdate({ mapValueKeys: mapValueKeys.map((v, _i) => i === _i ? val : v) })
              }
            }}
          />
        )
      }
    </WidgetControlCard>
  )
}

export default MapValueControls
