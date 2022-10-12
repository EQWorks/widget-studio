export default {
  'dev-table-1': {
    'title': 'table example widget',
    'showTitleBar': true,
    'type': 'table',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [
      {
        'key': 'submitted_deals',
        'title': 'Submitted deals',
      },
      {
        'key': 'approved_deals',
        'title': 'Approved deals',
      },
      {
        'key': 'funded_deals',
        'title': 'Funded deals',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'resolution',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Resolution',
    'uniqueOptions': {
      'showTicks': true,
      'spline': false,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
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
    'dataSource': {
      'type': 'Execution',
      'id': '1830',
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
  'dev-stat-1': {
    'title': 'stat example widget',
    'showTitleBar': true,
    'type': 'stat',
    'filters': [
      {
        key: 'resolution',
        filter: [20000],
      },
    ],
    'groupFilter': [],
    'valueKeys': [
      {
        'key': 'submitted_deals',
        'title': 'Submitted deals',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'resolution',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Resolution',
    'uniqueOptions': {
      'showTicks': true,
      'spline': false,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLabels': true,
      'showCurrency': false,
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
    'dataSource': {
      'type': 'Execution',
      'id': '1830',
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
  'dev-stat-2': {
    'title': 'stat trend example',
    'showTitleBar': true,
    'type': 'stat',
    'filters': [
      {
        key: 'dealerId',
        filter: [1],
      },
    ],
    'groupFilter': [],
    'valueKeys': [
      {
        'key': 'submitted_deals',
        'title': 'Submitted deals',
      },
      {
        'key': 'funded_deals',
        'title': 'funded deals',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'dealerId',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Dealer Id',
    'uniqueOptions': {
      'showTicks': true,
      'spline': false,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLabels': true,
      'showCurrency': false,
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
    'dataSource': {
      'type': 'Manual',
      'id': '2001',
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
  'dev-pie-1': {
    'title': 'My example pie widget',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
  },
  'dev-pie-2': {
    'title': 'Percentage widget',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
    },
    'dataSource': {
      'type': 'Execution',
      'id': '141',
    },
  },
  'dev-pie-3': {
    'title': 'Paymi Sample 1',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
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
    'dataSource': {
      'type': 'Execution',
      'id': '1591',
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
  'dev-bar-1': {
    'title': 'My example bar widget',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': true,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
  },
  'dev-bar-2': {
    'title': 'Time/Price Widget',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': true,
        'y': true,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
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
  'dev-bar-3' : {
    'title': 'My example bar - benchmark widget',
    'showTitleBar': true,
    'type': 'bar',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [
      {
        'title': 'Visitation',
        'key': 'visitation',
      },
      {
        'key': 'city',
        'title': 'City',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'location_category',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Location category',
    'uniqueOptions': {
      'stacked': false,
      'showTicks': true,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
      'showSubPlotTitles': true,
      'showLabels': false,
      'mapHideSourceLayer': false,
      'mapHideTargetLayer': false,
      'mapHideArcLayer': false,
      'subPlots': false,
      'size': 0.6,
      'titlePosition': [
        0,
        1,
      ],
      'legendPosition': [
        0.5,
        0,
      ],
      'legendSize': 'Small',
      'baseColor': '#363ee3',
    },
    'dataSource': {
      'type': 'Manual',
      'id': '2000',
    },
    'percentageMode': false,
    'addUserControls': true,
    'userControlHeadline': 'Top 10 Consumer Spending Categories    Benchmark by',
    'userControlKeyValues': [
      'city',
      'provincial',
      'national',
    ],
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#363ee3',
    ],
    'mapTooltipLabelTitles': null,
  },
  'dev-bar-4' : {
    'title': 'Insights on Top 10 Consumer Spending Categories',
    'subtitle': 'Check sub-categories of the Top 10 Spending Categories in your Market Area.',
    'subtitleLinkLabel': 'Learn More',
    'subtitleHyperlink': 'https://www.eqworks.com/',
    'showTitleBar': true,
    'type': 'bar',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [
      {
        'title': 'Market area',
        'key': 'market_area',
      },
      {
        'title': 'City',
        'key': 'city',
      },
      {
        'title': 'Province',
        'key': 'province',
      },
      {
        'key': 'country',
        'title': 'Country',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'name',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Name',
    'uniqueOptions': {
      'stacked': false,
      'showTicks': true,
      'horizontal': false,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': {
        'x': false,
        'y': true,
      },
      'axisTitles': {
        'x': '',
        'y': 'Score',
      },
      'showSubPlotTitles': true,
      'showLabels': false,
      'showCurrency': false,
      'showVertical': false,
      'mapHideSourceLayer': false,
      'mapHideTargetLayer': false,
      'mapHideArcLayer': false,
      'subPlots': false,
      'size': 0.8,
      'titlePosition': [
        0,
        0,
      ],
      'legendPosition': [
        0.5,
        0,
      ],
      'labelPosition': 'Bottom',
      'legendSize': 'Small',
      'baseColor': '#00548a',
      'xAxisLabelLength': 5,
    },
    'dataSource': {
      'type': 'Manual',
      'id': '4000',
    },
    'percentageMode': false,
    'addUserControls': false,
    'userControlHeadline': 'Benchmark By',
    'userControlKeyValues': [],
    'addTopCategories': true,
    'categoryFilter': null,
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#00548a',
    ],
    'mapTooltipLabelTitles': null,
    'wl': 2423,
  },
  'dev-line-1': {
    'title': 'Another Line Widget',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': true,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '191',
    },
  },
  'dev-line-2': {
    'title': 'My example line widget',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': true,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
    },
    'dataSource': {
      'type': 'Execution',
      'id': '305',
    },
  },
  'dev-scatter-1': {
    'title': 'My example scatter widget',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': true,
        'y': true,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
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
  'dev-map-1': {
    'title': 'My example map widget - polygon geojson layer FSA & postal code',
    'showTitleBar': true,
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
        'value': 10000,
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
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
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
  'dev-map-2': {
    'title': 'My example map widget - scatterplot layer',
    'showTitleBar': true,
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
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
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
  'dev-map-3': {
    'title': 'My example map widget - xwi report',
    'showTitleBar': true,
    'type': 'map',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': null,
    'mapGroupKey': null,
    'indexKey': null,
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
      'targetRadius': {
        'value': 10,
        'valueOptions': [
          5,
          15,
        ],
      },
      'targetFill': {
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
      'arcWidth': {
        'value': 1,
        'valueOptions': [
          1,
          20,
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
      'size': {
        'value': 4,
      },
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
      'showSubPlotTitles': true,
      'showLabels': false,
      'mapHideSourceLayer': false,
      'mapHideTargetLayer': false,
      'mapHideArcLayer': false,
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
    'dataSource': {
      'type': 'Execution',
      'id': '2123',
    },
    'percentageMode': false,
    'addUserControls': false,
    'userControlHeadline': 'Benchmark By',
    'userControlKeyValues': [],
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#366fe4',
    ],
    'mapTooltipLabelTitles': {
      'sourceTitle': 'Poi name',
    },
  },
  'dev-map-4': {
    'title': 'My example map widget - user value controls',
    'subtitle': '',
    'subtitleLinkLabel': '',
    'subtitleHyperlink': '',
    'showTitleBar': false,
    'type': 'map',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [],
    'mapValueKeys': [
      {
        'mapVis': 'fill',
        'key': 'pop',
        'title': 'Population',
      },
    ],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': null,
    'mapGroupKey': 'geo_ca_fsa',
    'indexKey': null,
    'mapGroupKeyTitle': 'Geo ca fsa',
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
      'targetRadius': {
        'value': 10,
        'valueOptions': [
          5,
          15,
        ],
      },
      'targetFill': {
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
      'arcWidth': {
        'value': 1,
        'valueOptions': [
          1,
          20,
        ],
      },
      'elevation': {
        'value': 10000,
      },
      'lineWidth': {
        'value': 1,
      },
      'opacity': {
        'value': 30,
      },
      'size': {
        'value': 4,
      },
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
      'showSubPlotTitles': true,
      'showLabels': false,
      'showCurrency': false,
      'showVertical': false,
      'mapHideSourceLayer': false,
      'mapHideTargetLayer': false,
      'mapHideArcLayer': false,
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
      'labelPosition': 'Bottom',
      'legendSize': 'Small',
      'baseColor': '#366fe4',
      'xAxisLabelLength': 5,
    },
    'dataSource': {
      'type': 'Manual',
      'id': '3000',
    },
    'percentageMode': false,
    'addUserControls': true,
    'userControlHeadline': 'Benchmark By',
    'userControlKeyValues': [
      'pop',
      'home_value',
      'highest_education_no_education',
      'highest_education_secondary_education',
      'highest_education_apprenticeship_trades',
      'highest_education_college_uni_below_bachelor',
      'highest_education_uni_bachelor',
      'highest_education_uni_advanced',
    ],
    'addTopCategories': false,
    'categoryFilter': null,
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#366fe4',
    ],
    'mapTooltipLabelTitles': null,
  },
  'dev-map-5':{
    'title': 'My example map widget - user value controls - top segments',
    'subtitle': '',
    'showTitleBar': true,
    'type': 'map',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [],
    'mapValueKeys': [
      {
        'mapVis': 'fill',
        'key': 'health_and_beauty',
        'title': 'Health and beauty',
        'agg': 'unique',
      },
    ],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': null,
    'mapGroupKey': 'geo_ca_fsa',
    'indexKey': null,
    'mapGroupKeyTitle': 'Geo ca fsa',
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
      'targetRadius': {
        'value': 10,
        'valueOptions': [
          5,
          15,
        ],
      },
      'targetFill': {
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
      'arcWidth': {
        'value': 1,
        'valueOptions': [
          1,
          20,
        ],
      },
      'elevation': {
        'value': 10000,
      },
      'lineWidth': {
        'value': 1,
      },
      'opacity': {
        'value': 30,
      },
      'size': {
        'value': 4,
      },
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': false,
      'showLegend': true,
      'showTooltip': true,
      'showAxisTitles': {
        'x': false,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
      'showSubPlotTitles': true,
      'showLabels': false,
      'showCurrency': false,
      'showVertical': false,
      'mapHideSourceLayer': false,
      'mapHideTargetLayer': false,
      'mapHideArcLayer': false,
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
      'labelPosition': 'Bottom',
      'legendSize': 'Small',
      'baseColor': '#366fe4',
      'xAxisLabelLength': 5,
    },
    'dataSource': {
      'type': 'Manual',
      'id': '5000',
    },
    'percentageMode': false,
    'addUserControls': true,
    'userControlHeadline': 'Benchmark By',
    'userControlKeyValues': [
      'arts_aficionados',
      'health_and_beauty',
      'small_business_owners',
      'readers',
      'car_owner',
      'students',
      'small_business_insights',
      'online_savvy_shoppers',
    ],
    'addTopCategories': false,
    'categoryFilter': 'segment_type',
    'presetColors': [
      '#3232F5',
      '#07A0C3',
      '#F0C808',
      '#91F5AD',
      '#dd1c1a',
      '#366fe4',
    ],
    'mapTooltipLabelTitles': null,
  },
  'filter-test-1': {
    'title': 'Household income',
    'showTitleBar': true,
    'type': 'bar',
    'filters': [],
    'groupFilter': [],
    'valueKeys': [
      {
        'title': '0-50%',
        'key': 'hh_income_0_50',
      },
      {
        'title': '50-100%',
        'key': 'hh_income_50_100',
      },
      {
        'title': '100-150%',
        'key': 'hh_income_100_150',
      },
      {
        'title': '150-200%',
        'key': 'hh_income_150_200',
      },
      {
        'key': 'hh_income_200_over',
        'title': '200%+',
      },
    ],
    'mapValueKeys': [],
    'formatDataFunctions': {},
    'group': true,
    'groupKey': 'resolution',
    'mapGroupKey': null,
    'indexKey': null,
    'groupKeyTitle': 'Resolution',
    'uniqueOptions': {
      'stacked': false,
      'showTicks': true,
      'donut': false,
      'showPercentage': true,
    },
    'genericOptions': {
      'showWidgetTitle': false,
      'groupByValue': true,
      'showLegend': false,
      'showTooltip': true,
      'showAxisTitles': {
        'x': true,
        'y': false,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
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
    'dataSource': {
      'type': 'Execution',
      'id': '1825',
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
  'dev-pyramid-1': {
    'title': 'My example pyramid widget',
    'showTitleBar': true,
    'type': 'pyramid',
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
      'showPercentage': false,
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
      'xAxisLabelLength': 5,
      'showAxisTitles': {
        'x': false,
        'y': true,
      },
      'axisTitles': {
        'x': '',
        'y': '',
      },
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187',
    },
  },
}
