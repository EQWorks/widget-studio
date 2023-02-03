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
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => {
      const {
        hidePagination,
        headerTitle,
        compactTable,
        centerHeader,
        barColumns,
        borderType,
        headerColor,
      } = uniqueOptions
      const { formatDataFunctions } = config

      return ({
        rows: data,
        showHeader: false,
        formatData: formatDataFunctions,
        barColumns: barColumns.length ? barColumns : false,
        barColumnsColor: genericOptions?.baseColor?.color1,
        hidePagination,
        headerTitle,
        title,
        defaultStyles: {
          borderType,
          headerColor,
          compactTable,
          centerHeader,
        },
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
