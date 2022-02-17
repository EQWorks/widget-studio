import { convert12to24 } from '../util/time'


export const DATE_RESOLUTIONS = {
  NONE: 'None',
  HOUR: 'Hour',
  DAY: 'Day',
  MONTH: 'Month',
  YEAR: 'Year',
}
var MONTHS_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const dateAggregations = {
  [DATE_RESOLUTIONS.NONE]: {
    groupFn: v => v,
    sortFn: (a, b) => a - b,
  },
  [DATE_RESOLUTIONS.HOUR]: {
    groupFn: v => (new Date(v)).toLocaleString('en-US', { hour: 'numeric' }),
    sortFn: (a, b) => convert12to24(a) - convert12to24(b),
  },
  [DATE_RESOLUTIONS.DAY]: {
    groupFn: v => (new Date(v)).toLocaleString('en-US', { weekday: 'short' }),
    sortFn: (a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b),
  },
  [DATE_RESOLUTIONS.MONTH]: {
    groupFn: v => (new Date(v)).toLocaleString('en-US', { month: 'short' }),
    sortFn: (a, b) => MONTHS_ORDER.indexOf(a) - MONTHS_ORDER.indexOf(b),
  },
  [DATE_RESOLUTIONS.YEAR]: {
    groupFn: v => (new Date(v)).toLocaleString('en-US', { year: 'numeric' }).toString(),
    sortFn: (a, b) => a - b,
  },
}

export const dateSort = (a, b) => new Date(a) - new Date(b)
