export default {
  'pie-1': {
    'title': 'My example pie widget',
    'type': 'pie',
    'filters': {
      'city_clicks': [
        20,
        308,
      ],
      'geo_ca_city': [
        'LAVAL',
        'MONTREAL',
        'MIRABEL',
        'BROSSARD',
      ],
    },
    'valueKeys': [
      {
        'key': 'city_clicks',
        'title': 'City clicks (mean)',
        'agg': 'mean',
        'id': 'city_clicks_mean',
      },
      {
        'key': 'city_impressions',
        'title': 'City impressions (sum)',
        'agg': 'sum',
      },
    ],
    'group': true,
    'groupKey': 'geo_ca_city',
    'indexKey': null,
    'groupKeyTitle': 'Geo ca city',
    'options': {
      'showPercentage': true,
      'donut': true,
    },
    'genericOptions': {
      'showLegend': true,
      'subPlots': true,
      'baseColor': '#f2ff00',
      'size': 0.6,
      'titlePosition': [
        0.5,
        1,
      ],
      'legendPosition': [
        1,
        0,
      ],
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
  },
  'pie-2': {
    'title': 'Percentage widget',
    'type': 'pie',
    'filters': {},
    'valueKeys': [
      {
        'key': 'renters',
        'title': 'Renters (mean)',
        'agg': 'mean',
      },
      {
        'key': 'owners',
        'title': 'Owners (mean)',
        'agg': 'mean',
      },
    ],
    'group': true,
    'groupKey': 'city',
    'indexKey': null,
    'groupKeyTitle': 'City',
    'options': {
      'showPercentage': true,
      'donut': false,
    },
    'genericOptions': {
      'showLegend': true,
      'subPlots': true,
      'titlePosition': [
        0,
        1,
      ],
      'groupByValue': true,
      'size': 0.6,
      'baseColor': '#366fe4',
      'legendPosition': [
        1,
        0,
      ],
    },
    'dataSource': {
      'type': 'Execution',
      'id': '141',
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
        'title': 'Converted users (mean)',
        'agg': 'mean',
        'id': 'converted_users_mean',
      },
      {
        'key': 'city_clicks',
        'title': 'City clicks (sum)',
        'agg': 'sum',
      },
    ],
    'group': true,
    'groupKey': 'geo_ca_city',
    'indexKey': null,
    'groupKeyTitle': 'Geo ca city',
    'options': {
      'stacked': true,
      'showTicks': true,
    },
    'genericOptions': {
      'showLegend': true,
      'subPlots': false,
      'size': 0.6,
      'titlePosition': [
        0,
        1,
      ],
      'legendPosition': [
        1,
        1,
      ],
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
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
        'title': 'Clicks',
      },
      {
        'key': 'revenue',
        'title': 'Revenue',
      },
    ],
    'group': false,
    'groupKey': null,
    'indexKey': 'impressions',
    'indexKeyTitle': 'Impressions',
    'options': {
      'spline': true,
      'showTicks': true,
    },
    'genericOptions': {
      'showLegend': true,
      'subPlots': true,
      'size': 0.8,
      'titlePosition': [
        0,
        1,
      ],
      'legendPosition': [
        1,
        0,
      ],
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '191',
    },
  },
  'line-2': {
    'title': 'My example line widget',
    'type': 'line',
    'filters': {},
    'valueKeys': [
      {
        'key': 'spend',
        'title': 'Spend',
      },
      {
        'key': 'clicks',
        'title': 'Clicks',
      },
    ],
    'group': false,
    'groupKey': null,
    'indexKey': 'impressions',
    'indexKeyTitle': 'Impressions',
    'options': {
      'spline': false,
      'showTicks': true,
    },
    'genericOptions': {
      'showLegend': true,
      'subPlots': false,
      'size': 0.2,
      'legendPosition': [
        1,
        1,
      ],
    },
    'dataSource': {
      'type': 'Execution',
      'id': '305',
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
        'title': 'Repeat visitors (mean)',
        'agg': 'mean',
      },
      {
        'key': 'unique_visitors',
        'title': 'Unique visitors (sum)',
        'agg': 'sum',
      },
    ],
    'group': true,
    'groupKey': 'address_postalcode',
    'indexKey': null,
    'groupKeyTitle': 'Address postalcode',
    'options': {
      'showTicks': true,
    },
    'genericOptions': {
      'showLegend': true,
      'subPlots': false,
      'size': 0.8,
      'groupByValue': false,
      'legendPosition': [
        1,
        1,
      ],
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '217',
    },
  },
  'map-1': {
    'title': 'My example map widget',
    'type': 'map',
    'filters': { 'visits': [0, 100] },
    'mapValueKeys': [
      {
        'key': 'visits',
        'agg': 'sum',
        'mapVis': 'radius',
      },
      {
        'key': 'unique_visitors',
        'agg': 'sum',
        'mapVis': 'fill',
      },
    ],
    'group': true,
    'mapGroupKey': 'poi_name',
    'dataSource': {
      'type': 'Execution',
      'id': '913',
    },
    'options': {
      'showTooltip': true,
      'showLegend': true,
    },
  },
}
