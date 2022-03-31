import types from '../../../constants/types'
import Stat from './local-components/stat'


export default {
  [types.STAT]: {
    component: Stat,
    adapt: (data, { title, uniqueOptions, genericOptions, ...config }) => ({
      data,
      // x: config.groupKeyTitle,
      values: config.valueKeys.map(({ title }) => title),
      ...(genericOptions.showWidgetTitle && { title }),
      ...uniqueOptions,
      ...genericOptions,
    }),
  },
}
