
export const MAP_LAYERS = [
  'scatterplot',
  'targetScatterplot',
  'geojson',
  'arc',
  'icon',
  'MVT',
].reduce((a, v) => ({ ...a, [v]: v }), {})

// visualizations used in Value Configuration
export const MAP_VALUE_VIS = [
  'radius',
  'elevation',
  'fill',
  'targetRadius',
  'targetFill',
  'arcWidth',
].reduce((a, v) => ({ ...a, [v]: v }), {})

// other visualizations
export const MAP_VIS_OTHERS = [
  'lineWidth',
  'lineColor',
  'size',
].reduce((a, v) => ({ ...a, [v]: v }), {})

export const MAP_LAYER_VALUE_VIS = {
  scatterplot: [MAP_VALUE_VIS.fill, MAP_VALUE_VIS.radius],
  targetScatterplot: [MAP_VALUE_VIS.targetFill, MAP_VALUE_VIS.targetRadius],
  geojson: [MAP_VALUE_VIS.fill, MAP_VALUE_VIS.elevation],
  MVT: [MAP_VALUE_VIS.fill, MAP_VALUE_VIS.elevation],
  arc: [MAP_VALUE_VIS.arcWidth],
  icon: [],
}

export const MAP_VIEW_STATE = {
  value: {
    latitude: 55,
    longitude: -102,
    zoom: 2.5,
  },
  postalCode: {
    latitude: 43.65,
    longitude: -79.4,
    zoom: 9.1,
  },
  lat: 'mapview_lat',
  lon: 'mapview_lon',
}

export const GEO_KEY_TYPES = {
  fsa: ['geo_ca_fsa', 'geo_cohort_fsa', 'household_fsa'],
  postalcode: [
    'geo_ca_postalcode',
    'geo_cohort_postalcode',
    'household_postalcode',
    'hh_postalcode',
    'address_postalcode',
  ],
  da: ['geo_ca_da'],
  ct: ['geo_ca_ct'],
  region: ['geo_ca_region', 'address_region'],
}

export const GEO_KEY_TYPE_NAMES = Object.keys(GEO_KEY_TYPES).reduce((acc, curr) => {
  acc[curr] = curr
  return acc
}, {})

export const MAP_LAYER_GEO_KEYS = {
  scatterplot: [
    'poi',
    'Poi',
    'poi_id',
    'Poi id',
    'locus_poi_id',
    'Locus poi id',
  ],
  targetScatterplot: ['target_poi_id', 'Target poi id'],
  // arc layer has no specific & unique geo keys to be identified with
  arc: [],
  geojson: Object.values(GEO_KEY_TYPES).flat(),
  MVT: Object.values(GEO_KEY_TYPES).flat(),
  icon: [],
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
    'source_lat',
    'source_latitude',
    MAP_VIEW_STATE.lat,
  ],
  longitude: [
    'lon',
    'lng',
    'longitude',
    'poi_lon',
    'poi_longitude',
    'locus_poi_lon',
    'source_lon',
    'source_lng',
    'source_longitude',
    MAP_VIEW_STATE.lon,
  ],
  // targetPOI coords need to be separated because they are the markers for xwi-reports
  targetLon: [
    'target_lon',
    'target_lg',
    'target_longitude',
    'target_poi_lon',
    'target_poi_lg',
    'target_poi_longitude',
  ],
  targetLat: [
    'target_lat',
    'target_latitude',
    'target_poi_lat',
    'target_poi_latitude',
  ],
}

export const XWI_REPORT = {
  target: 'target',
  source: 'poi',
}

export const GEOJSON_KEYS = ['type', 'geometry']

export const LAYER_SCALE = 'linear'

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

export const PITCH = {
  defaultValue: 0,
  elevation: 45,
}

export const MIN_ZOOM = {
  defaultValue: 2,
  postalCode: 8,
}

export const MAX_ZOOM = {
  defaultValue: 23,
  geojson: 14,
}

export const LABEL_OFFSET = {
  point: 5,
  polygon: -30,
}

export const CENSUS_REGEX = {
  postalcode: /^([A-Z][0-9]){3}/g,
  fsa: /^[A-Z][0-9][A-Z]/g,
  ct: /^[0-9]{7}[.][0-9]{2}/g,
  da: /^[0-9]{8}/g,
  region: /^(AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)/g,
}

export const KEY_ALIASES = {
  'Poi id': 'POI ID',
  'Poi name': 'POI name',
  'Locus poi id': 'POI ID',
  'Address region': 'Region',
  'Geo ca region': 'Region',
  'Geo ca postalcode': 'Postal code',
  'Address postalcode': 'Postal code',
  'Geo ca fsa': 'FSA',
  'Geo cohort fsa': 'GeoCohort FSA',
  'Geo ca da': 'DA',
  'Geo ca ct': 'CT',
}

export const XWI_KEY_ALIASES = {
  'Poi id': 'Source POI ID',
  'Target poi id': 'Target POI ID',
  'Poi name': 'Source POI name',
  'Target poi name': 'Target POI name',
}

export const ONE_ICON_SIZE = 10
