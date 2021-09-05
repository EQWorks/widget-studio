import { BarChart, PieChart, LineChart, ScatterChart } from '@eqworks/chart-system'

export default {
  bar: [
    BarChart,
    (rows, config) => ({
      data: rows.slice(0, 15),
      groupMode: config.options.stack ? 'stacked' : 'grouped',
      ...config.options.indexBy && { indexBy: config.options.indexBy },
      ...config.options.group ?
        {
          groupByKey: config.options.groupBy,
          valueKey: config.options.keys[0],
        }
        :
        {
          keys: config.options.keys,
        },
      // axisBottomLegendLabel: ???,
      ...config.options.group && config.options.keys[0] && {
        axisLeftLegendLabel: config.options.keys[0],
      },
    })
  ],
  line: [
    LineChart,
    (rows, config) => ({
      // title={title}
      data: rows.slice(0, 15),
      ...config.options.indexByValue &&
      {
        indexBy: config.options.indexBy,
      },
      yKeys: config.options.y,
      xKey: config.options.x,
      xScale: { type: 'point' },
      indexByValue: config.options.indexByValue,
      axisBottomLegendLabel: config.options.x,
      axisLeftLegendLabel: config.options.y.join(', '),
    })
  ],
  pie: [
    PieChart,
    (rows, config) => ({
      //   title:title ,
      data: rows.slice(0, 15),
      dataKey: config.options.keys[0], // TODO support multi..?
      indexBy: config.options.indexBy,
      isDonut: config.options.donut,
    }),
  ],
  scatter: [
    ScatterChart,
    (rows, config) => ({
      //   title:title ,
      data: rows.slice(0, 15),
      xKey: config.options.x,
      yKeys: config.options.y,
      indexBy: config.options.indexBy,
    })
  ]
}
