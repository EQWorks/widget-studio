export const MAP_LAYERS = {
  scatterplot: 'scatterplot',
  MVT: 'MVT',
  // geojson: 'geojson',
}

export const MAP_VIS = {
  radius: 'radius',
  elevation: 'elevation',
  fill: 'fill',
}

export const MAP_LAYER_VIS = {
  scatterplot: [MAP_VIS.fill, MAP_VIS.radius],
  MVT: [MAP_VIS.fill],
  // geoJSONPoint: [MAP_VIS.fill, MAP_VIS.radius],
  // geoJSONPolygon: [MAP_VIS.fill, MAP_VIS.elevation],
}

export const MAP_LAYER_GEO_KEYS = {
  scatterplot: [
    'poi',
    'poi_id',
    'locus_poi_id',
    'source_poi',
    'source_poi_id',
    'target_poi',
    'target_poi_id',
  ],
  MVT: ['geo_ca_fsa', 'geo_ca_postalcode', 'geo_ca_da', 'geo_ca_ct', 'geo_id'],
  // geoJSONPolygon: ['geo_ca_province'],
}

export const MAP_GEO_KEYS = Object.values(MAP_LAYER_GEO_KEYS).flat()

export const COORD_KEYS = {
  latitude: [
    'lat',
    'latitude',
    'poi_lat',
    'poi_latitude',
    'source_lat',
    'source_latitude',
    'source_lon',
    'source_longitude',
  ],
  longitude: [
    'lon',
    'lng',
    'longitude',
    'poi_lon',
    'poi_longitude',
    'source_lon',
    'source_longitude',
    'target_lon',
    'target_longitude',
  ],
}

// ----TO DO: ERIKA - this has to be moved to state later on, when we give more options in editor
export const VIS_OPTIONS = {
  values: {
    fill: [[214, 232, 253], [39, 85, 196]],
    radius: [5, 15],
  },
  scale: 'linear',
}

export const OPACITY = 0.3
