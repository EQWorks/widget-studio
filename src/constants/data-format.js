import numeral from 'numeral'
import { quickNumericFormat } from '../util/numeric'


export const DATA_KEY_FORMATTING = {
  currency : {
    keyList: ['cost', 'spend', 'revenue'],
    formatFunction: val => numeral(val).format('$0,0.00'),
  },
  money: {
    keyList: ['income'],
    formatFunction: val => numeral(val).format('$0,0'),
  },
  percentage: {
    keyList: ['rate', 'ctr'],
    formatFunction: val => numeral(val).format('0.00%'),
  },
  others: {
    keyList: ['transit', 'approved', 'degree', 'value', 'minivans', 'honda', 'public transit'],
    formatFunction: val => val * 100 + '%',
  },
  distance_others: {
    keyList: ['distance'],
    formatFunction: val =>  val + 'km',
  },
  numericOthers: {
    keyList: [],
    formatFunction: quickNumericFormat,
  },
}
