import { MAP_LAYER_GEO_KEYS, COORD_KEYS } from '../constants/map'


// TO DO: extend conditions for polygon geojson & arc layers when implementing those layers as well
export const geoKeyHasCoordinates = (geoKey, numericColumns) =>
  (MAP_LAYER_GEO_KEYS.scatterplot.includes(geoKey) &&
    numericColumns?.some(key => COORD_KEYS.latitude.includes(key)) &&
    numericColumns?.some(key => COORD_KEYS.longitude.includes(key))) ||
  (MAP_LAYER_GEO_KEYS.geojson.includes(geoKey))

export const isObject = v => v !== null && !Array.isArray(v) && typeof v === 'object'
