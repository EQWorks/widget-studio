import Table from '../../../components/table'
import types from '../../../constants/types'
import Stat from './local-components/stat'
import Text from './local-components/text'


export default {
  [types.STAT]: {
    component: Stat,
    adapt: (data, { title, valueKeys, genericOptions, uniqueOptions, onAfterPlot, ...config }) => ({
      data,
      title,
      values: valueKeys,
      formatData: config.formatDataFunctions,
      genericOptions,
      uniqueOptions,
      onAfterPlot,
    }),
  },
  [types.TABLE]: {
    component: Table,
    adapt: (data, {title}) => {
      console.log('title: ', title)
      return ({
        rows: data,
        showHeader: false,
        barColumns: true
      })
    },
  },
  [types.TEXT]: {
    component: Text,
    adapt: (_, { valueKeys, genericOptions }) => ({
      value: valueKeys[0]?.text,
      genericOptions,
    }),
  },
}
