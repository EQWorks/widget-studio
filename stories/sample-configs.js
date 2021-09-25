export default {
  'pie-1': {
    'title': 'My example pie widget',
    'type': 'pie',
    'filters': {
      'city_clicks': [
        80,
        308
      ]
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187'
    },
    'options': {
      'indexBy': 'geo_ca_city',
      'keys': [
        {
          'name': 'city_clicks',
          'agg': 'mean'
        }
      ],
      'showPercentage': true,
      'donut': false
    }
  },
  'bar-1': {
    'title': 'My example bar widget',
    'type': 'bar',
    'filters': {
      'city_clicks': [
        30,
        138
      ]
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '187'
    },
    'options': {
      'indexBy': 'geo_ca_city',
      'stacked': true,
      'showTicks': false,
      'keys': [
        {
          'name': 'converted_users',
          'agg': 'mean'
        },
        {
          'name': 'city_clicks',
          'agg': 'sum'
        }
      ]
    }
  },
  'line-1': {
    'title': 'Another Line Widget',
    'type': 'line',
    'filters': {
      'clicks': [
        107,
        528
      ]
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '191'
    },
    'options': {
      'indexBy': null,
      'spline': true,
      'showTicks': true,
      'x': 'clicks',
      'keys': [
        {
          'name': 'revenue'
        },
        {
          'name': 'clicks',
        }
      ]
    }
  },
  'line-2': {
    'title': 'My example line widget',
    'type': 'line',
    'dataSource': {
      'type': 'Execution',
      'id': '305'
    },
    'filters': {},
    'options': {
      'indexBy': null,
      'spline': false,
      'showTicks': false,
      'x': 'impressions',
      'keys': [
        {
          'name': 'spend',
        },
        {
          'name': 'clicks',
        }
      ]
    }
  },
  'scatter-1': {
    'title': 'My example scatter widget',
    'type': 'scatter',
    'filters': {
      'unique_visitors': [
        0,
        891
      ]
    },
    'dataSource': {
      'type': 'Saved query',
      'id': '217'
    },
    'options': {
      'indexBy': 'address_postalcode',
      'x': 'unique_visitors',
      'keys': [
        {
          'name': 'repeat_visitors',
          'agg': 'mean'
        },
        {
          'name': 'unique_visitors',
          'agg': 'sum'
        }
      ],
      'showTicks': false
    }
  }
}
