import { Icons } from '@eqworks/lumen-labs'
import { priceStringToNumeric } from '../util/numeric'
import { isString } from '../util/string-manipulation'


export const columnTypes = {
  NUMERIC: 'Numeric',
  DATE: 'Date',
  STRING: 'String',
  PRICE: 'Price',
}

export const columnTypeInfo = {
  // 'primitives':
  [columnTypes.NUMERIC]: {
    Icon: Icons.Hash,
    validate: (v, name) => {
      const res = !isNaN(v)
      return name === undefined
        ? res
        : res && !name.endsWith('_id')
    },
  },
  [columnTypes.STRING]: {
    Icon: Icons.Edit,
    validate: isString,
  },
  // subtypes:
  [columnTypes.PRICE]: {
    parentTypes: [
      columnTypes.NUMERIC,
    ],
    Icon: Icons.Dollar,
    validate: (v) => isString(v) && !isNaN(priceStringToNumeric(v)),
    normalize: (c) => c.map(priceStringToNumeric),
  },
  [columnTypes.DATE]: {
    parentTypes: [
      columnTypes.STRING,
    ],
    Icon: Icons.Table, // looks like a calendar
    validate: (v, name) => {
      if (!isString(v) || name.endsWith('_id')) {
        return false
      }
      const sample = new Date(v)
      return sample instanceof Date && !isNaN(sample)
    },
  },
}
