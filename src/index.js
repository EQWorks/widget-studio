import { createElement } from 'react'
import { setup } from 'goober'
import { shouldForwardProp } from 'goober/should-forward-prop'

import Widget from './widget'


export { default as WidgetManager } from './widget-manager'
export { default as InsightsDataProvider } from './insights-data-provider'

setup(createElement, undefined, undefined, shouldForwardProp((prop) => {
  return !['showLegend', 'legendPosition'].includes(prop)
}))

export default Widget
