import Table from '../../../components/table'
import types from '../../../constants/types'
import Stat from './local-components/stat'


export default {
  [types.STAT]: {
    component: Stat,
    adapt: (data, { title, valueKeys, genericOptions, uniqueOptions, onAfterPlot, ...config }) => {
      return ({
        data,
        title,
        values: valueKeys,
        formatData: config.formatDataFunctions,
        genericOptions,
        uniqueOptions,
        onAfterPlot,
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
