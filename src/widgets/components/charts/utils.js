// for hod and dow only
export const groupJson = ({ results, groupKey, key }) => {
  //groupkey = 'report_id'
  //key = 'converted_visits_dow'
  const reducer = (agg, datum) => {
    const _groupKey = datum[groupKey] // 3369 - value of report_id
    const currentValue = datum[key] // the json to be aggregated
    if (agg[_groupKey]) {
      for (let [_key, value] of Object.entries(currentValue)) {
        const aggValue = agg[_groupKey][_key]
        agg[_groupKey][_key] = aggValue + value
        // agg[_groupKey][_key] += value
      }
    } else {
      agg[_groupKey] = currentValue
    }
    return agg
    /** 3369: {
      'Mon': 0,
      'Tue': 0,
      'Wed': 7,
      'Thu': 0,
      'Fri': 3,
      'Sat': 0,
      'Sun': 11
    },*/
  }
  const data = results.reduce(reducer, {})
  return [Object.keys(data), data]
}

export const parseBar = ({ data, key = '', type='' }) => {
  //type = 'hour' || 'day' from isJson
  const parsedData = []
  const current = data[key]
  for (const [key, value] of Object.entries(current)) {
    const datum = { [type]: key, visits: value }
    parsedData.push(datum)
  }
  return parsedData
  /** parsedData:
   * [{
        "hour": "0",
        "visits": 19
      },
      {
        "hour": "1",
        "visits": 19
      }...
    ]
   */
}

// for hod and dow only
export const parseLine = ({ data, type }) => {
  // makes nivo data from groupJson but chart system breaks it
  // Object.entries(data).reduce((agg, [key, value]) => {
  //   const data = Object.entries(value).map(([x, y]) => ({ x, y }))
  //   agg.push({
  //     id: key,
  //     data,
  //   })
  //   return agg
  // }, [])
  /**outcome:
  [
    {
      "id": "ON",
      "data": [
        {
          "x": "0", // or "monday" for hod of dow
          "y": 13,
        }
        ...
      ]
    }...
  ]
   */
  // to be able to use chart-system, data has to be:
  const parsedData = []
  Object.entries(data).forEach(([key, value]) => {
    Object.entries(value).forEach(([_key, _value]) => {
      parsedData.push({ name: key, [type]: _key, visits: _value })
    })
  })
  return parsedData
  /** parsedData:
   * [{
        "name": "SK",
        "hour": "0",
        "visits": 19
      },
      {
        "name": "SK",
        "hour": "1",
        "visits": 19
      }...
    ]
   */
}

export const isJson = (key = '') => {
  const isMatch = key.match(/(?<hour>hod)|(?<day>dow)/)
  if (!isMatch) return false
  const { groups: { hour } } = isMatch
  return hour ? 'hour' : 'day'
}
