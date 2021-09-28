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
    'yKeys': {
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
    'yKeys': {
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
    'yKeys': {
      'revenue': {
        agg: null
      },
      'clicks': {
        agg: null
      },
    },
    'groupBy': null,
    'xKey': 'clicks',
    'options': {
      'spline': true,
      'showTicks': true,
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
    'yKeys': {
      'spend': {},
      'clicks': {},
    },
    'groupBy': null,
    'xKey': 'impressions',
    'options': {
      'spline': false,
      'showTicks': false,
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
    'yKeys': {
      'repeat_visitors': {
        'agg': 'mean'
      },
      'unique_visitors': {
        'agg': 'sum'
      }
    },
    'groupBy': 'address_postalcode',
    'xKey': 'unique_visitors',
    'options': {
      'showTicks': false
    }
  }
}
