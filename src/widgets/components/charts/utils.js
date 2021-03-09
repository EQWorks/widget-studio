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
export const getLayers = ({
  x = [],
  y = [],
  name = '',
  specs = {},
}) => {
  const { type } = specs
  const base = {
    x,
    y,
    name,
    showlegend: true,
  }
  switch (type) {
  case 'bar': {
    const _x = specs.isVertical ? x : y
    const _y = specs.isVertical ? y : x
    return {
      ...base,
      ...specs,
      x: _x,
      y: _y,
    }
    // delete props.isVertical
    // return props
  }
  case 'scatter': {
    return {
      ...base,
      ...specs,
    }
  }
  case 'pie': {
    delete base.x
    delete base.y
    return {
      ...base,
      ...specs,
    }
  }
  default:
    return base
  }
}

// group data that is NOT hod || dow
export const sum = ({ results, groupKey, yKeys }) => {
  const sumData = {} /** {
    ON: {converted_visits: 100, converted_repeat_visits: 40},
    ...
    } */
  results.forEach((datum) => {
    const key = datum[groupKey]?.trim().toLowerCase() // ON - value of region{
    // normalize keys
    const _groupKey = key?.charAt(0).toUpperCase() + key.slice(1)
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
  return sumData
}

// Plot.data with all layers
export const getChartData = ({
  sumData,
  chosenKey = []
}) => ({ specs }) => {
  const shouldProcessAll = !chosenKey.length //if no chosen key, process all
  const x = []
  const _y = {}
  const layers = Object.entries(sumData)
  for (let [name, data] of layers) {
    const proceed = shouldProcessAll || chosenKey.includes(name)
    if (proceed) {
      x.push(name)  // [ON, BC, SK ...]
      Object.entries(data).forEach(([key, value]) => (_y[key] = [..._y[key] || [], value]))
    }
  }
  const data = Object.entries(_y).map(([name, y]) => getLayers({ x, y, name, specs }))
  return data
}

export const getPieChartData = ({
  sumData,
  chosenKey = [],
  yKeys = [],
}) => ({ specs }) => {
  const shouldProcessAll = !chosenKey.length //if no chosen key, process all

  let labels = []
  let values = []
  const finalData = []

  if (yKeys.length > 1) {
    chosenKey.forEach((key) => {
      values = Object.values(sumData[key])
      labels = Object.keys(sumData[key])
      const _specs = {
        ...specs,
        name: key,
        values,
        labels
      }
      finalData.push(getLayers({ specs: _specs }))
    })
    return finalData
  }

  const pieData = Object.entries(sumData)
  for (let [name, data] of pieData) {
    const proceed = shouldProcessAll || chosenKey.includes(name)
    if (proceed) {
      labels.push(name)  // [ON, BC, SK ...]
      values.push(Object.values(data)[0])
    }
  }
  const _specs = {
    ...specs,
    values,
    labels
  }
  return [getLayers({ specs: _specs })]
}
