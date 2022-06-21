import { MAP_LAYER_VALUE_VIS } from '../constants/map'
import { EXCLUDE_NUMERIC, EXCLUDE_NUMERIC_ENDINGS } from '../constants/columns'
import { cleanUp } from './string-manipulation'

// used for Tooltip list of data { key: value } to display for xwi report when no data visualization is selected
export const getLayerValueKeys = ({ mapValueKeys, dataKeys, data, layer }) => {
  let layerValueKeys = mapValueKeys.filter(o => MAP_LAYER_VALUE_VIS[layer].includes(o.mapVis))
    .map(o => o.title)
  if (!layerValueKeys.length) {
    layerValueKeys = dataKeys.filter(col => !isNaN(data?.[0]?.[col]) &&
      !EXCLUDE_NUMERIC.some(key => cleanUp(key) === col || key === col) &&
      !EXCLUDE_NUMERIC_ENDINGS.some(key => col.endsWith(key)))
  }
  return layerValueKeys
}

// setup mapValueKeys list of map visualizations with empty values
export const setMapValueKeys = ({ mapLayer, dataIsXWIReport }) => {
  return (dataIsXWIReport ?
    [
      ...MAP_LAYER_VALUE_VIS.scatterplot,
      ...MAP_LAYER_VALUE_VIS.targetScatterplot,
      ...MAP_LAYER_VALUE_VIS.arc,
    ]
    :
    MAP_LAYER_VALUE_VIS[mapLayer]
  )?.map(vis => ({ mapVis: vis, key: '', agg: '' }))
}
