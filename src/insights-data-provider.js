import { cloneElement, useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { deepMap } from 'react-children-utilities'
import { useQueries } from 'react-query'

import { fetchInsightsData } from './util/api'
import Widget from './widget'
import withQueryClient from './util/with-query-client'


const InsightsDataProvider = ({ children, reportPeriod }) => {
  // keep track of which widgets need which data
  const [widgetDataDict, setWidgetDataDict] = useState({})
  const dataNeeded = useMemo(() => Object.values(widgetDataDict), [widgetDataDict])
  // dynamic parallel queries for insights data
  const fetchedData = useQueries(
    dataNeeded.map(name => ({
      queryKey: [name, reportPeriod],
      queryFn: () => fetchInsightsData(name, reportPeriod),
      refetchOnWindowFocus: false,
    }))
  )

  // record that the widget with ID 'id' wants to receive insights data 'dataName' for the current period
  const widgetCallback = useCallback((id, dataName) => setWidgetDataDict(d => ({ ...d, [id]: dataName })), [])

  return (
    // recursively map over children, applying special props to Widgets
    deepMap(children, child => {
      if (child.type !== Widget) {
        return child
      }
      // determine the ID of this widget
      const { props: { id } } = child
      // grab any data that may have been fetched for this widget
      const target = fetchedData[Object.keys(widgetDataDict).indexOf(`${id}`)]
      const { data } = target || {}
      const { results, columns } = data || {}
      return cloneElement(child, {
        // provide a callback for the widget to ask for data
        onInsightsDataRequired: widgetCallback,
        // pass the fetched data if available
        ...(results && columns && { rows: results, columns }),
      })
    }
    )
  )
}
InsightsDataProvider.propTypes = {
  children: PropTypes.node.required,
  reportPeriod: PropTypes.string.isRequired,
}

export default withQueryClient(InsightsDataProvider)
