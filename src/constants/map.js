export const MAP_LAYERS = {
  scatterplot: 'scatterplot',
  // MVT: 'MVT',
  geojson: 'geojson',
}

// visualizations used in Value Configuration
export const MAP_VALUE_VIS = {
  radius: 'radius',
  elevation: 'elevation',
  fill: 'fill',
}

// other visualizations
export const MAP_VIS_OTHERS = {
  lineWidth: 'lineWidth',
  lineColor: 'lineColor',
}

export const MAP_LAYER_VALUE_VIS = {
  scatterplot: [MAP_VALUE_VIS.fill, MAP_VALUE_VIS.radius],
  // MVT: [MAP_VALUE_VIS.fill],
  geojson: [MAP_VALUE_VIS.fill, MAP_VALUE_VIS.elevation],
}

export const GEO_KEY_TYPES = {
  fsa: ['geo_ca_fsa', 'geo_cohort_fsa', 'household_fsa'],
  postalcode: ['geo_ca_postalcode', 'geo_cohort_postalcode', 'household_postalcode'],
  da: ['geo_ca_da'],
  ct: ['geo_ca_ct'],
}

export const MAP_LAYER_GEO_KEYS = {
  scatterplot: [
    'poi',
    'poi_name',
    'poi_id',
    'locus_poi_id',
    'locus_poi_name',
  ],
  // geojson: Object.values(GEO_KEY_TYPES).flat(),
  // just remove for the moment postal codes, da & ct
  geojson: [...GEO_KEY_TYPES.fsa],
}

export const MAP_GEO_KEYS = Object.values(MAP_LAYER_GEO_KEYS).flat()

export const ID_KEYS = [
  'id',
  'geo_id',
  'geo_cohort_id',
  'source_poi',
  'source_poi_id',
  'target_poi',
  'target_poi_id',
  'ca_csd',
  'geo_ca_csd',
  'ggid',
  'report_id',
  'geocohort_id',
  'locus_poi_list_id',
  'chain_id',
  'beacon_id',
  'flight_code',
  'camp_code',
  ...MAP_GEO_KEYS,
]

export const COORD_KEYS = {
  latitude: [
    'lat',
    'latitude',
    'poi_lat',
    'poi_latitude',
    'locus_poi_lat',
  ],
  longitude: [
    'lon',
    'lng',
    'longitude',
    'poi_lon',
    'poi_longitude',
    'locus_poi_lon',
  ],
  other: [
    // TO DO: enable for xwi reports
    'source_lat',
    'source_latitude',
    'source_lat',
    'source_latitude',
    'source_lon',
    'source_longitude',
    'target_lon',
    'target_longitude',
  ],
}

export const LAYER_SCALE = 'linear'
export const PITCH = 45

export const MAP_LEGEND_POSITION = {
  '[0,0]': 'bottom-left',
  '[0,1]': 'top-left',
  '[1,1]': 'top-right',
  '[1,0]': 'bottom-right',
}

export const MAP_LEGEND_SIZE = {
  Small: 'sm',
  Large: 'lg',
}
