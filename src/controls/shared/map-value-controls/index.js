import React, { useCallback, useMemo } from 'react'

import aggFunctions from '../../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../../store'
import MapValueSelect from './map-value-select'
import XWIReportValueControls from './xwi-report-value-controls'
import WidgetControlCard from '../components/widget-control-card'
import cardTypes from '../../../constants/card-types'
import modes from '../../../constants/modes'
import { MAP_LAYER_VALUE_VIS } from '../../../constants/map'
import { hasDevAccess } from '../../../util/access'


const [PRIMARY_KEY, SECONDARY_KEY] = ['key', 'agg']

const MapValueControls = () => {
  // common actions
  const userUpdate = useStoreActions(actions => actions.userUpdate)
  const resetValue = useStoreActions(actions => actions.userUpdate)

  // common state
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)
  const mapLayer = useStoreState((state) => state.mapLayer)
  const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)
  const columnNameAliases = useStoreState((state) => state.columnNameAliases || {})

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const widgetControlCardDescription = useMemo(() => {
    if (!mapGroupKey && !dataIsXWIReport) {
      return 'Select a column to group by above to enable value configurations.'
    }
    if (mode === modes.QL && !dataIsXWIReport) {
      return 'Select key values, open in editor for more options.'
    }
    if (dataIsXWIReport) {
      return mode === modes.QL ?
        (
          <>
            <p>Select data columns for your choice of data</p>
            <p>visualization.</p>
          </>
        ) :
        'Select data columns for your choice of data visualization.'
    }
    return ''
  }, [mapGroupKey, dataIsXWIReport, mode])

  const callback = useCallback((i, val) => {
    // TO DO: find the source of this - prevents updating mapValueKeys from bubbled onClick events
    if (i === -1 && (val[PRIMARY_KEY] || val[SECONDARY_KEY])) {
      const valueKeysCopy = JSON.parse(JSON.stringify(mapValueKeys))
      valueKeysCopy.push(val)
      userUpdate({ mapValueKeys: valueKeysCopy })
    } else if (i !== -1 ) { // modify a key
      userUpdate({ mapValueKeys: mapValueKeys.map((v, _i) => i === _i ? val : v) })
    }
  }, [mapValueKeys, userUpdate])

  return (
    <WidgetControlCard
      clear={() => resetValue({ mapValueKeys, columnNameAliases })}
      showIfEmpty
      title='Value Configuration'
      description={widgetControlCardDescription}
      enableEdit
      disableEditButton={!hasDevAccess() ||
        ((mapValueKeys.every(({ key }) => !key)) && !widgetControlCardEdit[cardTypes.VALUE])
      }
      type={cardTypes.VALUE}
    >
      {dataIsXWIReport ?
        (
          <XWIReportValueControls
            data={numericColumns}
            callback={callback}
          />
        ) :
        (mapLayer &&
          <MapValueSelect
            categories={MAP_LAYER_VALUE_VIS[mapLayer]}
            titles={['Column', 'Operation', 'Alias']}
            data={numericColumns}
            subData={mapGroupKey ? Object.keys(aggFunctions) : []}
            disableSubs={!dataHasVariance}
            disableSubMessage="doesn't require aggregation."
            callback={callback}
          />
        )
      }
    </WidgetControlCard>
  )
}

export default MapValueControls
