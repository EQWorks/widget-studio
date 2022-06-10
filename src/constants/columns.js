import { Icons } from '@eqworks/lumen-labs'
import { priceStringToNumeric } from '../util/numeric'
import { isString } from '../util/string-manipulation'
import { MAP_GEO_KEYS, ID_KEYS, COORD_KEYS } from './map'


export const EXCLUDE_NUMERIC = [
  ...['whitelabel', 'customer', 'resolution'],
  ...MAP_GEO_KEYS,
  ...ID_KEYS,
  ...Object.values(COORD_KEYS).flat(),
]

export const EXCLUDE_NUMERIC_ENDINGS = ['name', 'type', 'id']

export const columnTypes = {
  NUMERIC: 'Numeric',
  DATE: 'Date',
  STRING: 'String',
  PRICE: 'Price',
}

export const columnTypeInfo = {
  // 'primitives':
  [columnTypes.NUMERIC]: {
    color: 'yellow',
    Icon: Icons.Hash,
    validate: (v, name) => {
      const res = !isNaN(v)
      return name === undefined
        ? res
        : res && !EXCLUDE_NUMERIC_ENDINGS.some(key => name.endsWith('_' + key)) &&
         !EXCLUDE_NUMERIC.includes(name)
    },
  },
  [columnTypes.STRING]: {
    color: 'purple',
    Icon: Icons.Edit,
    validate: isString,
  },
  // subtypes:
  [columnTypes.PRICE]: {
    color: 'yellow',
    parentTypes: [
      columnTypes.NUMERIC,
    ],
    Icon: Icons.Dollar,
    validate: (v) => isString(v) && !isNaN(priceStringToNumeric(v)),
    normalize: (c) => c.map(priceStringToNumeric),
  },
  [columnTypes.DATE]: {
    color: 'red',
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
