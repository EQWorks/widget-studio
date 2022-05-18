import {
  MAP_LAYER_VALUE_VIS,
  MAP_LAYER_GEO_KEYS,
  COORD_KEYS,
  EXCLUDE_NUMERIC,
} from '../constants/map'


// TO DO: extend conditions for polygon geojson & arc layers when implementing those layers as well
export const geoKeyHasCoordinates = (geoKey, numericColumns) =>
  (MAP_LAYER_GEO_KEYS.scatterplot.includes(geoKey) &&
    numericColumns?.some(key => COORD_KEYS.latitude.includes(key)) &&
    numericColumns?.some(key => COORD_KEYS.longitude.includes(key))) ||
  (MAP_LAYER_GEO_KEYS.geojson.includes(geoKey))

export const isObject = v => v !== null && !Array.isArray(v) && typeof v === 'object' && !(v instanceof HTMLElement)

export const getLayerValueKeys = ({ mapValueKeys, dataKeys, data, layer }) => {
  let layerValueKeys = mapValueKeys.filter(o => MAP_LAYER_VALUE_VIS[layer].includes(o.mapVis))
    .map(o => o.title)
  if (!layerValueKeys.length) {
    layerValueKeys =  dataKeys.filter(col => EXCLUDE_NUMERIC.every(key => !col.includes(key)) &&
      !isNaN(data?.[0]?.[col]))
  }
  return layerValueKeys
}
