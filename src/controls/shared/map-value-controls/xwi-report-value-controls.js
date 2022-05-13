// specific value control component for xwi report data
import React from 'react'

import { makeStyles } from '@eqworks/lumen-labs'

import MapValueSelect from './map-value-select'
import { useStoreState } from '../../../store'
import { MAP_LAYER_VALUE_VIS } from '../../../constants/map'


const classes = makeStyles({
  layerValueControls:{
    marginBottom: '1rem',
  },
})

const XWI_MAP_LAYERS = [
  {
    categories: MAP_LAYER_VALUE_VIS.scatterplot,
    header: 'Source Layer',
  },
  {
    categories: MAP_LAYER_VALUE_VIS.targetScatterplot,
    header: 'Target Layer',
  },
  {
    categories: MAP_LAYER_VALUE_VIS.arc,
    header: 'Arc Layer',
  },
]

const XWIReportValueControls = ({ data, callback }) => {
  const mapValueKeys = useStoreState((state) => state.mapValueKeys)

  return (
    XWI_MAP_LAYERS.map(({ categories, header }, i) => (
      <div key={i} className={classes.layerValueControls}>
        <p>{header}</p>
        <MapValueSelect
          categories={categories}
          values={mapValueKeys}
          data={data}
          callback={callback}
        />
      </div>
    ))
  )
}

export default XWIReportValueControls
