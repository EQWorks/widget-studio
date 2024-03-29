import React, { createElement, useMemo } from 'react'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useExecutions, useSavedQueries } from '../../../util/api'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import { renderItem, renderToggle } from '../../shared/util'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { columnTypeInfo, columnTypes } from '../../../constants/columns'
import { dataSourceTypes } from '../../../constants/data-source'
import {
  yearClientRegExp,
  yearMonthClientRegExp,
  clientIdRegExp,
  yearQuarterClientRegExp,
} from '../../../constants/regexp'


const classes = makeStyles({
  dataSelection: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.7rem',
  },
  dataSourceLabelContainer: {
    width: '100%',
    color: getTailwindConfigColor('secondary-600'),
    fontWeight: 700,
    fontSize: '0.857rem',
    padding: '0.429rem 0.714rem',
    '--tw-shadow': '0px 1px 4px rgba(81, 113, 151, 0.1)',
    boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
  },
  dropdownDescriptionContainer: {
    display: 'flex',
  },
  dropdownDescriptionText: {
    flex: 1,
  },
  dropdownDescriptionIcons: {
    display: 'flex',
    '> *': {
      marginRight: '0.4rem',
    },
    '> :last-child': {
      marginRight: '0px !important',
    },
  },
})

const DataSourceControls = () => {
  const resetWidget = useStoreActions((actions) => actions.resetWidget)
  const userUpdate = useStoreActions((actions) => actions.userUpdate)

  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const cu = useStoreState((state) => state.cu)
  const dev = useStoreState((state) => state.dev)
  const noDataSource = useStoreState((state) => state.noDataSource)

  const [executionsLoading, executionsList] = useExecutions()
  const [, savedQueriesList] = useSavedQueries()

  const dataSourceList = useMemo(() => (
    Array.isArray(executionsList)
      ? executionsList.filter(({ customerID, clientToken }) => (customerID == cu || cu === -1 || dev) &&
          ((dataSourceType === dataSourceTypes.INSIGHTS_DATA && clientToken) ||
            dataSourceType !== dataSourceTypes.INSIGHTS_DATA))
        .map(({ queryID, executionID, columns, views = [], clientToken }) => {
          const reportYearClient = clientToken?.match(yearClientRegExp)?.[0]
          const reportYearMonthClient = clientToken?.match(yearMonthClientRegExp)?.[0]
          const reportYearQuarterClient = clientToken?.match(yearQuarterClientRegExp)?.[0]
          const clientId = clientToken?.match(clientIdRegExp)?.[0]
          const reportType = clientToken?.replace(reportYearClient || reportYearMonthClient || reportYearQuarterClient || clientId, '')
          let reportSuffix = ''
          if (reportYearClient) {
            reportSuffix = '_Y'
          }
          if (reportYearMonthClient) {
            reportSuffix = '_YM'
          }
          if (reportYearQuarterClient) {
            reportSuffix = '_Y3M'
          }
          let name
          if (dataSourceType === dataSourceTypes.INSIGHTS_DATA) {
            name = reportType?.split('_')?.map((word) => word.replace(/./, v => v.toUpperCase())
            ).join(' ')
          } else {
            name = (savedQueriesList.find(({ queryID: _id }) => queryID === _id) || {}).name
          }
          return {
            id: executionID,
            queryID,
            reportType,
            reportSuffix,
            label: `${dataSourceType === dataSourceTypes.INSIGHTS_DATA ?
              '' : `[${executionID}]`} ${name || `unsaved: ${views.map(({ id }) => id).join(', ')}`}`,
            description: (
              <span key={executionID} className={classes.dropdownDescriptionContainer}>
                <span className={classes.dropdownDescriptionText}>
                  {`${columns?.length} column${columns?.length !== 1 ? 's' : ''}`}
                </span>
                <span className={classes.dropdownDescriptionIcons}>
                  {[... new Set(columns.map(({ category }) => category).filter(c => Object.values(columnTypes).includes(c)))]
                    .sort()
                    .map((c, i) => createElement(columnTypeInfo[c]?.Icon, { size: 'sm', key: i }))}
                </span>
              </span>
            ),
          }
        })
      : []
  ), [dataSourceType, cu, dev, executionsList, savedQueriesList])

  const selected = useMemo(() => {
    if (dataSourceType === dataSourceTypes.EXECUTIONS) {
      if (dataSourceType === dataSourceTypes.SAVED_QUERIES) {
        return dataSourceList?.find(({ queryID }) => Number(queryID) === Number(dataSourceID))
      }
      return dataSourceList?.find(({ id }) => Number(id) === Number(dataSourceID))
    }
    return dataSourceList?.find(({ reportType }) => reportType === (dataSourceID?.toString()?.replace('_YM', '')))
  } , [dataSourceID, dataSourceType, dataSourceList])

  const placeholder = useMemo(() => {
    if (executionsLoading) {
      return 'Loading...'
    } else if (dataSourceType === dataSourceTypes.INSIGHTS_DATA) {
      return 'Select Insights Data'
    } else {
      return 'Select Execution'
    }
  }, [executionsLoading, dataSourceType])

  return (
    <WidgetControlCard title='Data Source' >
      <div className={classes.dataSelection}>
        {
          renderToggle(
            'No Data',
            noDataSource,
            v => userUpdate({ noDataSource: v }),
          )
        }
        {
          renderItem(
            dataSourceType === dataSourceTypes.INSIGHTS_DATA ?
              'Insights data' : 'Query Execution',
            <CustomSelect
              allowClear={false}
              // disabled={executionsLoading || executionsList === []}
              disabled={(Array.isArray(executionsList) && !executionsList.length) || noDataSource}
              placeholder={placeholder}
              fullWidth
              value={selected?.label}
              descriptions={dataSourceList?.map(({ description }) => description)}
              data={dataSourceList?.map(({ label }) => label)}
              onSelect={v => {
                const { reportSuffix, reportType } = dataSourceList?.find(({ label }) => v === label) || {}
                resetWidget()
                userUpdate({
                  reportType,
                  reportSuffix,
                  dataSource: {
                    type: dataSourceType === dataSourceTypes.INSIGHTS_DATA ?
                      dataSourceTypes.INSIGHTS_DATA :
                      dataSourceTypes.EXECUTIONS,
                    id: dataSourceType === dataSourceTypes.INSIGHTS_DATA ?
                      reportType + reportSuffix :
                      v.split('[')[1].split(']')[0], // TODO something that is not this
                  },
                })
              }}
            />,
          )
        }
      </div>
    </WidgetControlCard >
  )
}

export default DataSourceControls
