import sampleConfigs from '../sample-configs'
import sampleData from '../sample-data'


export const devRequestData = async (dataSourceType, dataSourceID) => (
  sampleData[`${dataSourceType}-${dataSourceID}`]
)

export const devRequestConfig = async (id) => (
  sampleConfigs[id] || {}
)
