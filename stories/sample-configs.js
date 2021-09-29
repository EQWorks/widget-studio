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
    'valueKeys': {
      'city_clicks': {
        'agg': 'mean'
      },
    },
    'groupKey': 'geo_ca_city',
    'genericOptions': {
      'subPlots': false,
    },
    'options': {
      'showPercentage': true,
      'showLegend': true,
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
    'genericOptions': {
      'subPlots': false,
    },
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
    'valueKeys': {
      'revenue': {
        agg: null
      },
      'impressions': {
        agg: null
      },
    },
    'group': false,
    'groupKey': null,
    'indexKey': 'clicks',
    'genericOptions': {
      'subPlots': true,
    },
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
    'valueKeys': {
      'spend': {},
      'clicks': {},
    },
    'groupKey': null,
    'indexKey': 'impressions',
    'genericOptions': {
      'subPlots': false,
    },
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
    'valueKeys': {
      'repeat_visitors': {
        'agg': 'mean'
      },
      'unique_visitors': {
        'agg': 'sum'
      }
    },
    'groupKey': 'address_postalcode',
    'indexKey': 'unique_visitors',
    'genericOptions': {
      'subPlots': false,
    },
    'options': {
      'showTicks': false
    }
  }
}
