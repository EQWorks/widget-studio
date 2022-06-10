import { MAP_LAYER_VALUE_VIS } from '../constants/map'
import { EXCLUDE_NUMERIC } from '../constants/columns'


export const getLayerValueKeys = ({ mapValueKeys, dataKeys, data, layer }) => {
  let layerValueKeys = mapValueKeys.filter(o => MAP_LAYER_VALUE_VIS[layer].includes(o.mapVis))
    .map(o => o.title)
  if (!layerValueKeys.length) {
    layerValueKeys = dataKeys.filter(col => !EXCLUDE_NUMERIC.some(key => key === col) &&
      !isNaN(data?.[0]?.[col]))
  }
  return layerValueKeys
}

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
