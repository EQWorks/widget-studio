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
  'pie-3': {
    'title': 'Paymi Sample 1',
    'type': 'pie',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [
      {
        'key': 'Dollars Rewarded',
        'title': 'Dollars Rewarded (mean)',
        'agg': 'mean',
      },
      {
        'key': 'Number of Transactions',
        'title': 'Number of Transactions (sum)',
        'agg': 'sum',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'consumer_gender',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Consumer gender',
    'uniqueOptions': {
      'donut': false,
      'showPercentage': true,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': true,
      'showSubPlotTitles': true,
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
      'legendSize': 'Small',
      'baseColor': '#366fe4',
    },
    'mapViewState': {
      'latitude': 44.41,
      'longitude': -79.23,
      'zoom': 7,
    },
    'dataSource': {
      'type': 'Execution',
      'id': '1589',
    },
    'percentageMode': false,
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#366fe4',
    ],
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
  'bar-2': {
    'title': 'Time/Price Widget',
    'type': 'bar',
    'filters': [],
    'groupFilter': [
      '2019-08-28',
      '2020-08-27',
    ],
    'valueKeys': [
      {
        'key': 'price',
        'title': 'Price (mean)',
        'agg': 'mean',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'time',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Time',
    'uniqueOptions': {
      'stacked': false,
      'showTicks': true,
      'spline': true,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
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
      'legendSize': 'Small',
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Execution',
      'id': '1458',
    },
    'percentageMode': false,
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#463F3A',
    ],
    'dateAggregation': 'Hour',
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
          1474,
        ],
      },
      {
        'key': 'repeat_visitors',
        'filter': [
          43,
          399,
        ],
      },
    ],
    'groupFilter': [],
    'valueKeys': [
      {
        'key': 'unique_visitors',
        'title': 'Unique visitors',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': false,
    'groupKey': null,
    'mapGroupKey': null,
    'indexKey': 'repeat_visitors',
    'indexKeyTitle': 'Repeat visitors',
    'uniqueOptions': {
      'showTicks': true,
      'showLines': false,
    },
    'genericOptions': {
      'showWidgetTitle': true,
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
        0.5,
      ],
      'legendSize': 'Small',
      'baseColor': '#366fe4',
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '217',
    },
    'percentageMode': false,
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#463F3A',
    ],
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
        'mapVis': 'radius',
        'key': 'visits',
        'title': 'Visits (sum)',
        'agg': 'sum',
      },
      {
        'title': 'Unique visitors (sum)',
        'title:': 'Unique visitors (sum)',
        'mapVis': 'fill',
        'key': 'unique_visitors',
        'agg': 'sum',
      },
    ],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': null,
    'mapGroupKey': 'poi_id',
    'indexKey': null,
    'mapGroupKeyTitle': 'Poi id',
    'uniqueOptions': {
      'radius': {
        'value': 10,
        'valueOptions': [
          5,
          15,
        ],
      },
      'fill': {
        'value': [
          39,
          85,
          196,
        ],
        'valueOptions': [
          [
            214,
            232,
            253,
          ],
          [
            39,
            85,
            196,
          ],
        ],
      },
      'elevation': {
        'value': 1000,
      },
      'lineWidth': {
        'value': 1,
      },
      'opacity': {
        'value': 20,
      },
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': true,
      'showSubPlotTitles': true,
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
      'legendSize': 'Small',
      'baseColor': '#366fe4',
    },
    'mapViewState': {
      'latitude': 44.41,
      'longitude': -79.23,
      'zoom': 7,
    },
    'dataSource': {
      'type': 'Execution',
      'id': '913',
    },
    'percentageMode': false,
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#463F3A',
    ],
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
        'mapVis': 'elevation',
        'key': 'impressions',
        'title': 'Impressions (sum)',
        'agg': 'sum',
      },
      {
        'title': 'Spend (sum)',
        'mapVis': 'fill',
        'key': 'spend',
        'agg': 'sum',
      },
    ],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': null,
    'mapGroupKey': 'geo_cohort_fsa',
    'indexKey': null,
    'mapGroupKeyTitle': 'Geo cohort fsa',
    'uniqueOptions': {
      'radius': {
        'value': 10,
        'valueOptions': [
          5,
          15,
        ],
      },
      'fill': {
        'value': [
          39,
          85,
          196,
        ],
        'valueOptions': [
          [
            214,
            232,
            253,
          ],
          [
            39,
            85,
            196,
          ],
        ],
      },
      'elevation': {
        'value': 20000,
      },
      'lineWidth': {
        'value': 1,
      },
      'opacity': {
        'value': 30,
      },
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': true,
      'showSubPlotTitles': true,
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
      'legendSize': 'Small',
      'baseColor': '#366fe4',
    },
    'mapViewState': {
      'latitude': 44.41,
      'longitude': -79.23,
      'zoom': 7,
    },
    'dataSource': {
      'type': 'Execution',
      'id': '1389',
    },
    'percentageMode': false,
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#366fe4',
    ],
  },
}
