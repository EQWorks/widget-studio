// specific value control component for xwi report data
import React, { useMemo } from 'react'

import { Icons,  Accordion } from '@eqworks/lumen-labs'

import MapValueSelect from './map-value-select'
import aggFunctions from '../../../util/agg-functions'
import { useStoreState, useStoreActions } from '../../../store'
import { MAP_LAYER_VALUE_VIS, COORD_KEYS, ID_KEYS } from '../../../constants/map'


const XWI_MAP_LAYERS = [
  {
    categories: MAP_LAYER_VALUE_VIS.scatterplot,
    header: 'Source Layer',
  },
  {
    categories: MAP_LAYER_VALUE_VIS.scatterplot,
    header: 'Target Layer',
  },
  {
    categories: MAP_LAYER_VALUE_VIS.arc,
    header: 'Arc Layer',
  },
]

const XWIReportValueControls = () => {

  // common actions
  const userUpdate = useStoreActions(actions => actions.userUpdate)

  // common state
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const dataHasVariance = useStoreState((state) => state.dataHasVariance)

  const mapNumericColumns = useMemo(() => (
    numericColumns.filter(col =>
      !Object.values(COORD_KEYS).flat().includes(col) &&
      !ID_KEYS.includes(col))
  ), [numericColumns])
  return (
    <Accordion className='flex-initial flex w-full' color='secondary' >
      {XWI_MAP_LAYERS.map(({ categories, header }, i) => (
        <Accordion.Panel
          key={i}
          id={i + 1}
          header={header}
          ExpandIcon={Icons.ChevronDown}
          classes={{ details: 'h-40 overflow-x-visible' }}
        >
          <MapValueSelect
            categories={categories}
            values={mapValueKeys}
            data={mapNumericColumns}
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
        </Accordion.Panel>
      ))}
    </Accordion>
  )
}

export default XWIReportValueControls
