export default {
  'pie-1': {
    'title': 'My example pie widget',
    'type': 'pie',
    'filters': [
      {
        'key': 'city_clicks',
        'filter': [
          20,
          308,
        ],
      },
    ],
    'groupFilter': [
      'LAVAL',
      'MONTREAL',
      'MIRABEL',
      'BROSSARD',
    ],
    'valueKeys': [
      {
        'key': 'city_clicks',
        'title': 'City clicks (mean)',
        'agg': 'mean',
      },
      {
        'key': 'city_impressions',
        'title': 'City impressions (sum)',
        'agg': 'sum',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'geo_ca_city',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Geo ca city',
    'uniqueOptions': {
      'showPercentage': true,
      'donut': true,
    },
    'genericOptions': {
      'groupByValue': false,
      'showLegend': true,
      'subPlots': true,
      'size': 0.6,
      'titlePosition': [
        0.5,
        1,
      ],
      'legendPosition': [
        1,
        0,
      ],
      'baseColor': '#f2ff00',
      'showWidgetTitle': false,
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
  },
  'pie-2': {
    'title': 'Percentage widget',
    'type': 'pie',
    'filters': [],
    'groupFilter': [],
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
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'city',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'City',
    'uniqueOptions': {
      'showPercentage': true,
      'donut': false,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': true,
      'showLegend': true,
      'subPlots': true,
      'size': 0.6,
      'titlePosition': [
        0,
        1,
      ],
      'legendPosition': [
        1,
        0,
      ],
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Execution',
      'id': '141',
    },
  },
  'bar-1': {
    'title': 'My example bar widget',
    'type': 'bar',
    'filters': [
      {
        'key': 'city_clicks',
        'filter': [
          30,
          138,
        ],
      },
    ],
    'groupFilter': [],
    'valueKeys': [
      {
        'key': 'converted_users',
        'title': 'Converted users (mean)',
        'agg': 'mean',
      },
      {
        'key': 'city_clicks',
        'title': 'City clicks (sum)',
        'agg': 'sum',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'geo_ca_city',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Geo ca city',
    'uniqueOptions': {
      'stacked': true,
      'showTicks': true,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
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
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
  },
  'line-1': {
    'title': 'Another Line Widget',
    'type': 'line',
    'filters': [
      {
        'key': 'clicks',
        'filter': [
          117,
          423,
        ],
      },
    ],
    'groupFilter': [],
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
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': false,
    'groupKey': null,
    'mapGroupKey': null,
    'indexKey': 'impressions',
    'indexKeyTitle': 'Impressions',
    'uniqueOptions': {
      'spline': true,
      'showTicks': true,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
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
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '191',
    },
  },
  'line-2': {
    'title': 'My example line widget',
    'type': 'line',
    'filters': [],
    'groupFilter': [],
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
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': false,
    'groupKey': null,
    'mapGroupKey': null,
    'indexKey': 'impressions',
    'indexKeyTitle': 'Impressions',
    'uniqueOptions': {
      'spline': false,
      'showTicks': true,
    },
    'genericOptions': {
      'groupByValue': false,
      'showLegend': true,
      'subPlots': false,
      'size': 0.2,
      'titlePosition': [
        0,
        0,
      ],
      'legendPosition': [
        1,
        1,
      ],
      'baseColor': '#366fe4',
      'showWidgetTitle': true,
    },
    'dataSource': {
      'type': 'Execution',
      'id': '305',
    },
  },
  'scatter-1': {
    'title': 'My example scatter widget',
    'type': 'scatter',
    'filters': [
      {
        'key': 'unique_visitors',
        'filter': [
          0,
          891,
        ],
      },
    ],
    'groupFilter': [],
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
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'address_postalcode',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Address postalcode',
    'uniqueOptions': {
      'showTicks': true,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'subPlots': false,
      'size': 0.8,
      'titlePosition': [
        0,
        0,
      ],
      'legendPosition': [
        1,
        1,
      ],
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '217',
    },
  },
  'map-1': {
    'title': 'My example map widget - scatterplot layer',
    'type': 'map',
    'filters': [
      {
        'key': 'visits',
        'filter': [
          0,
          100,
        ],
      },
    ],
    'groupFilter': [],
    'valueKeys': [],
    'mapValueKeys': [
      {
        'key': 'visits',
        'title': 'Visits (sum)',
        'agg': 'sum',
        'mapVis': 'radius',
      },
      {
        'key': 'unique_visitors',
        'title': 'Unique visitors (sum)',
        'agg': 'sum',
        'title:': 'Unique visitors (sum)',
        'mapVis': 'fill',
      },
    ],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': null,
    'mapGroupKey': 'poi_id',
    'indexKey': null,
    'mapGroupKeyTitle': 'Poi id',
    'uniqueOptions': {
      'opacity': 20,
      'lineWidth': {
        'value': 1,
      },
      'radius': {
        'valueOptions': [5, 10],
      },
      'fill': {
        'value': [39, 85, 196],
        'valueOptions': [[214, 232, 253], [39, 85, 196]],
      },
      'elevation': {
        'value': 0,
        'valueOptions': [0, 1000],
      },
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'subPlots': false,
      'size': 0.8,
      'titlePosition': [
        0,
        0,
      ],
      'legendPosition': [
        1,
        0,
      ],
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Execution',
      'id': '913',
    },
  },
  'map-2': {
    'title': 'My example map widget - polygon geojson layer',
    'type': 'map',
    'filters': [
      {
        'key': 'spend',
        'filter': [
          0,
          100,
        ],
      },
    ],
    'groupFilter': [],
    'valueKeys': [],
    'mapValueKeys': [
      {
        'key': 'impressions',
        'title': 'Impressions (sum)',
        'agg': 'sum',
        'title:': 'Impressions (sum)',
        'mapVis': 'elevation',
      },
      {
        'key': 'spend',
        'title': 'Spend (sum)',
        'agg': 'sum',
        'mapVis': 'fill',
      },
    ],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': null,
    'mapGroupKey': 'geo_cohort_fsa',
    'indexKey': null,
    'mapGroupKeyTitle': 'Geo cohort fsa',
    'uniqueOptions': {
      'opacity': 30,
      'lineWidth': {
        'value': 1,
      },
      'fill': {
        'value': [39, 85, 196],
        'valueOptions': [[214, 232, 253], [39, 85, 196]],
      },
      'elevation': {
        'value': 0,
        'valueOptions': [0, 1000],
      },
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'subPlots': false,
      'size': 0.8,
      'titlePosition': [
        0,
        0,
      ],
      'legendPosition': [
        1,
        0,
      ],
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Execution',
      'id': '1389',
    },
  },
}
