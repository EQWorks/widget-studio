// for hod and dow only
export const groupJson = ({ results, groupKey, key }) => {
  //groupkey = 'report_id'
  //key = 'converted_visits_dow'
  const reducer = (data, datum) => {
    const _groupKey = datum[groupKey] // 3369 - value of report_id
    const currentObj = datum[key] // the json to be aggregated
    if (data[_groupKey]) {
      for (let [_key, value] of Object.entries(currentObj)) {
        data[_groupKey][_key] += value
      }
    } else {
      data[_groupKey] = currentObj
    }
    return data
    /** {
     * 3369: {
      'Mon': 0,
      'Tue': 0,
      'Wed': 7,
      'Thu': 0,
      'Fri': 3,
      'Sat': 0,
      'Sun': 11
    }...
  }*/
  }
  const data = results.reduce(reducer, {})
  return [Object.keys(data), data]
}

const getAxisValues = (current) => {
  const x = []
  const y = []
  for (const [key, value] of Object.entries(current)) {
    x.push(key)
    y.push(value)
  }
  return { x, y }
}

// for hod and dow only
export const parseData = ({ data, keys = [] }) => {
  const parsedData = []
  if (keys.length) {
    keys.forEach((key) => {
      const current = data[key]
      const { x, y } = getAxisValues(current)
      parsedData.push({ x, y, name: key })
    })
  } else {
    for (const [key, value] of Object.entries(data)) {
      const { x, y } = getAxisValues(value)
      parsedData.push({ x, y, name: key })
    }
  }
  return parsedData
  /** parsedData:
   * [{
        x: ['0', '1', '2' ...],
        y: [19, 0, 2, 3 ...],
        name: 'ON'
      },
      {
        x: ['0', '1', '2' ...],
        y: [19, 0, 2, 3 ...],
        name: 'BC'
      }...
    ]
   */
}

// for hod and dow only
export const isJson = (key = '') => {
  const isMatch = key.match(/(?<hour>hod)|(?<day>dow)/)
  if (!isMatch) return false
  const { groups: { hour } } = isMatch
  return hour ? 'hour' : 'day'
}

// each layer of Plot.data
export const getLayers = ({ x, y, name, type, isVertical = true, area = false }) => {
  const base = {
    type,
    x,
    y,
    name,
    showlegend: true,
  }
  switch (type) {
  case 'bar': {
    const _x = isVertical ? x : y
    const _y = isVertical ? y : x
    return {
      ...base,
      x: _x,
      y: _y,
      orientation: isVertical ? 'v' : 'h'
    }
  }
  case 'scatter': {
    return {
      ...base,
      mode: 'lines+markers',
      ...(area && { fill: 'tonexty' })
    }
  }
  default:
    return base
  }
}
// Plot.data with all layers
export const getChartData = ({ results, groupKey, yKeys, isVertical = true, area = false, type }) => {
  const sumData = {} /** {
    ON: {converted_visits: 100, converted_repeat_visits: 40},
    ...
    } */
  results.forEach((datum) => {
    const _groupKey = datum[groupKey] // ON - value of region
    const current = sumData[_groupKey]
    if (current) {
      yKeys.forEach((key) => {
        current[key] += datum[key]
      })
    } else {
      const init = {}
      yKeys.forEach((key) => {
        init[key] = datum[key]
      })
      sumData[_groupKey] = init
      /** ON: {converted_visits: 100, converted_repeat_visits: 40} */
    }
  })
  const x = []
  const _y = {}
  const layers = Object.entries(sumData)
  for (let [name, data] of layers) {
    x.push(name)  // [ON, BC, SK ...]
    Object.entries(data).forEach(([key, value]) => (_y[key] = [..._y[key] || [], value]))
  }
  const data = Object.entries(_y).map(([name, y]) => getLayers({ x, y, name, isVertical, area, type }))
  return data
}
