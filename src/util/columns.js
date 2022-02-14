import { columnTypes, columnTypeInfo } from '../constants/columns'


export const columnInference = (columnData = [], columnName) => {
  const [v] = columnData // TODO infer based on multiple samples
  let checked = new Set()
  let matches = []
  Object.entries(columnTypeInfo)
    .sort(([, a], [, b]) => Boolean(b.parentTypes?.length) - Boolean(a.parentTypes?.length))
    .forEach(([k, { validate, parentTypes = [] }]) => {
      if (!(k in checked)) {
        checked.add(k)
        if (validate(v, columnName)) {
          matches.push(k)
          parentTypes.forEach(t => {
            matches.push(t)
            checked.add(t)
          })
        }
      }
    })
  const category = matches.shift() || columnTypes.STRING
  return {
    category,
    parentCategories: matches,
    isNumeric: category === columnTypes.NUMERIC || matches.includes(columnTypes.NUMERIC),
    Icon: columnTypeInfo[category].Icon,
  }
}
