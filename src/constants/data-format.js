import numeral from 'numeral'
import { quickNumericFormat } from '../util/numeric'


export const DATA_KEY_FORMATTING = {
  currency : {
    keyList: ['cost', 'spend', 'revenue', 'income'],
    formatFunction: val => numeral(val).format('$0,0'),
  },
  percentage: {
    keyList: ['rate', 'Rate', 'ctr'],
    formatFunction: val => numeral(val/100).format('0.00%'),
  },
  numericOthers: {
    keyList: [],
    formatFunction: quickNumericFormat,
  },
}
