import React from 'react'

import { aggFuncDict } from '../../../../view/adapter'
import { useStoreState, useStoreActions } from '../../../../store'
import CustomSelect from '../../../shared-components/custom-select'
import MapLinkedSelect from './map-linked-select'
import WidgetControlCard from '../../../shared-components/widget-control-card'
import { mapVis } from '../../../../constants/map'


const MapValueControls = () => {
  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const groupKey = useStoreState((state) => state.groupKey)
  const valueKeys = useStoreState((state) => state.valueKeys)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const stringColumns = useStoreState((state) => state.stringColumns)

  return (
    <>
      <WidgetControlCard title='Group by' >
        <CustomSelect
          data={stringColumns}
          value={groupKey}
          setChosenValue={val => update({ groupKey: val })}
        />
      </WidgetControlCard>
      <WidgetControlCard title='Value keys' >
        <MapLinkedSelect
          categories={Object.values(mapVis)}
          values={valueKeys}
          data={numericColumns}
          subData={groupKey ? Object.keys(aggFuncDict) : []}
          update={(val) => nestedUpdate({ valueKeys: val })}
          callback={(i, val) => {
            if (i === -1) { // add a key
              const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
              valueKeysCopy.push(val)
              update({ valueKeys: valueKeysCopy })
            } else { // modify a key
              update({ valueKeys: valueKeys.map((v, _i) => i === _i ? val : v) })
            }
          }}
          deleteCallback={(i) => {
            const valueKeysCopy = JSON.parse(JSON.stringify(valueKeys))
            valueKeysCopy.splice(i, 1)
            update({ valueKeys: valueKeysCopy })
          }}
        />
      </WidgetControlCard>
    </>
  )
}

export default MapValueControls
