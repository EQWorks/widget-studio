import Table from '../../../components/table'
import types from '../../../constants/types'
import Stat from './local-components/stat'


export default {
  [types.STAT]: {
    component: Stat,
    adapt: (data, { valueKeys, genericOptions }) => {
      console.log('data: ', {data, valueKeys, genericOptions})
      return ({
        data,
        values: valueKeys.map(({ title }) => title),
        genericOptions
      })
    },
  },
  [types.TABLE]: {
    component: Table,
    adapt: (data) => ({
      rows: data,
      showHeader: false,
    }),
  },
}
