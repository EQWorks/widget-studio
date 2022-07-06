import {
  MAP_LAYERS,
  GEO_KEY_TYPES,
  LABEL_OFFSET,
} from '../constants/map'
import { cleanUp } from './string-manipulation'


// setup pixel offset for Text layer for various type of geometries
export const pixelOffset = ({ mapLayer, radiusValue }) => () => d => {
  if (mapLayer === MAP_LAYERS.scatterplot) {
    return [radiusValue + LABEL_OFFSET.point, 0 - radiusValue - LABEL_OFFSET.point]
  }
  // special case for region/province - better placement of labels to avoid overlap in simple cases
  const regionKey = Object.keys(d.properties)
    .find(key => GEO_KEY_TYPES.region.some(regionKey => cleanUp(regionKey) === key))
  if (mapLayer === MAP_LAYERS.geojson && regionKey) {
    const addressRegion = d.properties[regionKey]
    if (addressRegion === 'AB') {
      return [-30, -20]
    }
    if (addressRegion === 'MB') {
      return [-50, -20]
    }
    if (['ON', 'QC'].includes(addressRegion)) {
      return [-80, -20]
    }
    if (addressRegion === 'NS') {
      return [0, 40]
    }
    if (addressRegion === 'PE') {
      return [0, -10]
    }
    if (addressRegion === 'NB') {
      return [-80, 20]
    }
    return [-30, 20]
  }
  return [LABEL_OFFSET.polygon, 0]
}
