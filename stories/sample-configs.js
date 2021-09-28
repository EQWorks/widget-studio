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
    'keys': {
      'city_clicks': {
        'agg': 'mean'
      },
    },
    'groupBy': 'geo_ca_city',
    'options': {
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
    'keys': {
      'converted_users': {
        'agg': 'mean'
      },
      'city_clicks': {
        'agg': 'sum'
      }
    },
    'groupBy': 'geo_ca_city',
    'options': {
      'stacked': true,
      'showTicks': false,
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
    'keys': {
      'revenue': {
        agg: null
      },
      'clicks': {
        agg: null
      },
    },
    'groupBy': null,
    'options': {
      'spline': true,
      'showTicks': true,
      'x': 'clicks',
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
    'keys': {
      'spend': {},
      'clicks': {},
    },
    'groupBy': null,
    'options': {
      'spline': false,
      'showTicks': false,
      'x': 'impressions',
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
    'keys': {
      'repeat_visitors': {
        'agg': 'mean'
      },
      'unique_visitors': {
        'agg': 'sum'
      }
    },
    'groupBy': 'address_postalcode',
    'options': {
      'x': 'unique_visitors',
      'showTicks': false
    }
  }
}
