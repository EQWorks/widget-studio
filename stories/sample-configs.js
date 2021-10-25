export default {
  'pie-1': {
    'title': 'My example pie widget',
    'type': 'pie',
    'filters': {
      'city_clicks': [
        20,
        308,
      ],
    },
    'valueKeys': [
      {
        'key': 'city_clicks',
        'agg': 'mean',
      },
    ],
    'group': true,
    'groupKey': 'geo_ca_city',
    'indexKey': null,
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
    'options': {
      'showPercentage': true,
      'showLegend': true,
      'donut': false,
    },
    'genericOptions': {
      'subPlots': true,
    },
  },
  'bar-1': {
    'title': 'My example bar widget',
    'type': 'bar',
    'filters': {
      'city_clicks': [
        30,
        138,
      ],
    },
    'valueKeys': [
      {
        'key': 'converted_users',
        'agg': 'mean',
      },
      {
        'key': 'city_clicks',
        'agg': 'sum',
      },
    ],
    'group': true,
    'groupKey': 'geo_ca_city',
    'indexKey': null,
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
    'options': {
      'stacked': true,
      'showTicks': true,
    },
    'genericOptions': {
      'subPlots': false,
    },
  },
  'line-1': {
    'title': 'Another Line Widget',
    'type': 'line',
    'filters': {
      'clicks': [
        117,
        423,
      ],
    },
    'valueKeys': [
      {
        'key': 'clicks',
        'agg': null,
      },
      {
        'key': 'revenue',
        'agg': null,
      },
    ],
    'group': false,
    'groupKey': null,
    'indexKey': 'impressions',
    'dataSource': {
      'type': 'Saved query',
      'id': '191',
    },
    'options': {
      'spline': true,
      'showTicks': true,
    },
    'genericOptions': {
      'subPlots': true,
    },
  },
  'line-2': {
    'title': 'My example line widget',
    'type': 'line',
    'filters': {},
    'valueKeys': [
      {
        'key': 'spend',
      },
      {
        'key': 'clicks',
      },
    ],
    'group': false,
    'groupKey': null,
    'indexKey': 'impressions',
    'dataSource': {
      'type': 'Execution',
      'id': '305',
    },
    'options': {
      'spline': false,
      'showTicks': true,
    },
    'genericOptions': {
      'subPlots': false,
    },
  },
  'scatter-1': {
    'title': 'My example scatter widget',
    'type': 'scatter',
    'filters': {
      'unique_visitors': [
        0,
        891,
      ],
    },
    'valueKeys': [
      {
        'key': 'repeat_visitors',
        'agg': 'mean',
      },
      {
        'key': 'unique_visitors',
        'agg': 'sum',
      },
    ],
    'group': true,
    'groupKey': 'address_postalcode',
    'indexKey': null,
    'dataSource': {
      'type': 'Saved query',
      'id': '217',
    },
    'options': {
      'showTicks': true,
    },
    'genericOptions': {
      'subPlots': false,
    },
  },
}
