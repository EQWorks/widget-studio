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
    'valueKeys': {
      'city_clicks': {
        'agg': 'mean'
      }
    },
    'group': true,
    'groupKey': 'geo_ca_city',
    'indexKey': null,
    'dataSource': {
      'type': 'Saved query',
      'id': '187'
    },
    'options': {
      'showPercentage': true,
      'showLegend': true,
      'donut': false
    },
    'genericOptions': {
      'subPlots': false
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
    'valueKeys': {
      'converted_users': {
        'agg': 'mean'
      },
      'city_clicks': {
        'agg': 'sum'
      }
    },
    'group': true,
    'groupKey': 'geo_ca_city',
    'indexKey': null,
    'dataSource': {
      'type': 'Saved query',
      'id': '187'
    },
    'options': {
      'stacked': true,
      'showTicks': false
    },
    'genericOptions': {
      'subPlots': false
    }
  },
  'line-1': {
    'title': 'Another Line Widget',
    'type': 'line',
    'filters': {
      'clicks': [
        117,
        423
      ]
    },
    'valueKeys': {
      'clicks': {
        'agg': null
      },
      'revenue': {
        'agg': null
      }
    },
    'group': false,
    'groupKey': null,
    'indexKey': 'impressions',
    'dataSource': {
      'type': 'Saved query',
      'id': '191'
    },
    'options': {
      'spline': true,
      'showTicks': true
    },
    'genericOptions': {
      'subPlots': true
    }
  },
  'line-2': {
    'title': 'My example line widget',
    'type': 'line',
    'filters': {},
    'valueKeys': {
      'spend': {},
      'clicks': {}
    },
    'group': false,
    'groupKey': null,
    'indexKey': 'impressions',
    'dataSource': {
      'type': 'Execution',
      'id': '305'
    },
    'options': {
      'spline': false,
      'showTicks': false
    },
    'genericOptions': {
      'subPlots': false
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
    'valueKeys': {
      'repeat_visitors': {
        'agg': 'mean'
      },
      'unique_visitors': {
        'agg': 'sum'
      }
    },
    'group': true,
    'groupKey': 'address_postalcode',
    'indexKey': null,
    'dataSource': {
      'type': 'Saved query',
      'id': '217'
    },
    'options': {
      'showTicks': false
    },
    'genericOptions': {
      'subPlots': false
    }
  }
}
