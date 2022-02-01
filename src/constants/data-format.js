import numeral from 'numeral'


export const DATA_KEY_FORMATTING = {
  currency : {
    keyList: ['cost', 'spend', 'revenue'],
    formatFunction: val => numeral(val).format('$0,0.00'),
  },
  percentage: {
    keyList: ['rate', 'ctr'],
    formatFunction: val => numeral(val).format('0.00%'),
  },
  numericOthers: {
    keyList: [],
    formatFunction: val => numeral(val).format('0,0'),
  },
}
