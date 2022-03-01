import React, { createElement, useMemo } from 'react'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useExecutions, useSavedQueries } from '../../../util/fetch'
import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import { renderRow } from '../../shared/util'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { columnTypeInfo, columnTypes } from '../../../constants/columns'
import { dataSourceTypes } from '../../../constants/data-source'


const classes = makeStyles({
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
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const cu = useStoreState((state) => state.cu)
  const dev = useStoreState((state) => state.dev)
  const [executionsLoading, executionsList] = useExecutions()
  const [, savedQueriesList] = useSavedQueries()

  const executions = useMemo(() => (
    Array.isArray(executionsList)
      ? executionsList.filter(({ customerID }) => customerID == cu || dev)
        .map(({ queryID, executionID, columns, views = [] }) => {
          const { name } = savedQueriesList.find(({ queryID: _id }) => queryID === _id) || {}
          return {
            id: executionID,
            queryID,
            label: `[${executionID}] ${name || `unsaved: ${views.map(({ id }) => id).join(', ')}`}`,
            description: (
              <span key={executionID} className={classes.dropdownDescriptionContainer}>
                <span className={classes.dropdownDescriptionText}>
                  {`${columns?.length} column${columns?.length !== 1 ? 's' : ''}`}
                </span>
                <span className={classes.dropdownDescriptionIcons}>
                  {[... new Set(columns.map(({ category }) => category).filter(c => Object.values(columnTypes).includes(c)))]
                    .sort()
                    .map(c => createElement(columnTypeInfo[c]?.Icon, { size: 'sm' }))}
                </span>
              </span>
            ),
          }
        })
      : []
  ), [cu, dev, executionsList, savedQueriesList])

  const selected = useMemo(() => (
    executions.find(
      dataSourceType === dataSourceTypes.SAVED_QUERIES
        ? ({ queryID }) => Number(queryID) === Number(dataSourceID)
        : ({ id }) => Number(id) === Number(dataSourceID)
    )
  ), [dataSourceID, dataSourceType, executions])

  return (
    <WidgetControlCard title='Data Source' >
      {
        renderRow(
          'Query Execution',
          <CustomSelect
            allowClear={false}
            disabled={executionsLoading || executionsList === []}
            placeholder={executionsLoading ? 'Loading...' : 'Select Execution'}
            fullWidth
            value={selected?.label}
            descriptions={executions.map(({ description }) => description)}
            data={executions?.map(({ label }) => label)}
            onSelect={v => userUpdate({
              dataSource: {
                type: dataSourceTypes.EXECUTIONS,
                id: v.split('[')[1].split(']')[0], // TODO something that is not this
              },
            })}
          />
        )
      }
    </WidgetControlCard >
  )
}

export default DataSourceControls
