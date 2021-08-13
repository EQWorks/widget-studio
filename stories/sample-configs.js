/*
bar: {
  group: boolean,
  groupBy: string,
  indexBy: string,
  stack: boolean,
  keys: Array<string>,
},

line: {
  indexByValue: boolean,
  keys: Array<string>,
  x: string,
  y: Array<string>,
},

pie: {
  indexBy: boolean,
  keys: Array<string>,
},

scatter: {
  indexBy: string,
  x: string,
  y: Array<string>,
}
*/

export default {
  'pie-1': {
    'title': 'My example pie widget',
    'type': 'pie',
    'dataSource': 'Saved query',
    'dataID': '187',
    'options': {
      'indexBy': 'geo_ca_city',
      'keys': [
        'city_impressions'
      ],
      'donut': false
    }
  },
  'bar-1': {
    'title': 'My example bar widget',
    'type': 'bar',
    'dataSource': 'Saved query',
    'dataID': '187',
    'options': {
      'group': false,
      'groupBy': null,
      'indexBy': 'geo_ca_city',
      'stack': false,
      'keys': [
        'converted_users',
        'city_clicks'
      ]
    }
  },
  'line-1': {
    'title': 'My example line widget',
    'type': 'line',
    'dataSource': 'Execution',
    'dataID': '305',
    'options': {
      'indexByValue': false,
      'indexBy': null,
      'x': 'impressions',
      'y': ['spend', 'clicks']
    }
  },
  'scatter-1': {
    'title': 'My example scatter widget',
    'type': 'scatter',
    'dataSource': 'Saved query',
    'dataID': '217',
    'options': {
      'indexBy': 'address_postalcode',
      'x': 'unique_visitors',
      'y': ['repeat_visitors']
    }
  },
}
