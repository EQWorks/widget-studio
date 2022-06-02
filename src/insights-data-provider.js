import { cloneElement, useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { deepMap } from 'react-children-utilities'
import { useQueries } from 'react-query'

import { fetchInsightsData } from './util/api'
import Widget from './widget'
import withQueryClient from './util/with-query-client'


const COX_WL = 2456
const COX_CU = 27848
const COX_SOURCE = 'cox'

const InsightsDataProvider = ({
  children,
  source = COX_SOURCE,
  year,
  month,
  _wl = COX_WL,
  _customer = COX_CU,
}) => {
  // keep track of which widgets need which data
  const [widgetDataDict, setWidgetDataDict] = useState({})
  const dataNeeded = useMemo(() => Object.values(widgetDataDict), [widgetDataDict])

  // dynamic parallel queries for insights data
  const fetchedData = useQueries(
    dataNeeded.map(name => ({
      queryKey: [name, year, month],
      queryFn: () => fetchInsightsData({ name, year, month, _wl, _customer })[source],
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
        wl: _wl,
        cu: _customer,
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
  children: PropTypes.node.isRequired,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

InsightsDataProvider.defaultProps = {
  month: null,
}

export default withQueryClient(InsightsDataProvider)
