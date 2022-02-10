export const MAP_LAYERS = {
  scatterplot: 'scatterplot',
  // MVT: 'MVT',
  geojson: 'geojson',
}

export const MAP_VIS = {
  radius: 'radius',
  elevation: 'elevation',
  fill: 'fill',
}

export const MAP_LAYER_VIS = {
  scatterplot: [MAP_VIS.fill, MAP_VIS.radius],
  // MVT: [MAP_VIS.fill],
  geojson: [MAP_VIS.fill, MAP_VIS.elevation],
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
    'poi_id',
    'locus_poi_id',
  ],
  geojson: Object.values(GEO_KEY_TYPES).flat(),
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

// ----TO DO: ERIKA - this has to be moved to state later on, when we give more options in editor
export const VIS_OPTIONS = {
  fill: {
    valueOptions: [[214, 232, 253], [39, 85, 196]],
    value: [39, 85, 196],
    label: 'Fill Color',
    info: 'Calculate fill color based on the selected column and operation.',
  },
  radius: {
    valueOptions: [5, 15],
    value: 10,
    label: 'Radius',
    info: 'Calculate radius based on the selected column and operation.',
  },
  elevation: {
    valueOptions: [1, 1000],
    value: 0,
    label: 'Elevation',
    info: 'Calculate elevation height based on the selected column and operation.',
  },
  scale: 'linear',
}

export const OPACITY = 0.2
export const PITCH = { elevation: 45 }

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
