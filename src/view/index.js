import React, { useMemo } from 'react'

import { Loader } from '@eqworks/lumen-labs'

import { DashboardLayout, Table } from '../components/icons'
import CustomSwitch from '../components/custom-switch'
import FadeBetween from '../components/fade-between'
import ResultsTable from './table'
import { useStoreState, useStoreActions } from '../store'
import WidgetAdapter from './adapter'


const WidgetView = () => {

  // store actions
  const nestedUpdate = useStoreActions((actions) => actions.nestedUpdate)

  // widget state
  const type = useStoreState((state) => state.type)
  const rows = useStoreState((state) => state.rows)
  const isReady = useStoreState((state) => state.isReady)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const showTable = useStoreState((state) => state.ui.showTable)
  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)
  const dataSourceError = useStoreState((state) => state.ui.dataSourceError)

  // descriptive message to display when the data source is still loading
  const dataSourceLoadingMessage = useMemo(() => (
    dataSourceType && dataSourceID ?
      `Loading ${dataSourceType.charAt(0).toLowerCase() + dataSourceType.slice(1)} ${dataSourceID}`
      :
      'Loading'
  ), [dataSourceType, dataSourceID])

  // descriptive messages to display when the data source is finished loading but the widget cannot yet be rendered
  const widgetWarning = useMemo(() => ({
    primary:
      !dataSourceID || !dataSourceType ? 'Please select a data source.'
        : dataSourceError ? 'Something went wrong.'
          : !rows.length ? 'Sorry, this data is empty.'
            : type ? 'Select columns and configure your widget.'
              : 'Select a widget type.',
    secondary:
      dataSourceError ? `${dataSourceError}`
        : 'Data loaded successfully',
  }), [dataSourceError, dataSourceID, dataSourceType, rows.length, type])

  const renderWidgetWarning =
    <div className='h-full flex-1 flex flex-col justify-center items-center'>
      {
        dataSourceLoading ?
          <div className='m-3'>
            <Loader open classes={{ icon: 'text-primary-700' }} />
          </div>
          :
          <span className='font-semibold text-lg text-secondary-500'>{widgetWarning.primary}</span>
      }
      <span className='text-md text-secondary-500'>
        {dataSourceLoading ? dataSourceLoadingMessage : widgetWarning.secondary}
      </span>
    </div>

  return (
    dataReady ?
      <div className='w-full h-full flex flex-col'>
        <CustomSwitch
          className='flex-0 mt-3 ml-5'
          labels={['widget', 'table']}
          icons={[DashboardLayout, Table]}
          value={showTable}
          update={(val) => nestedUpdate({ ui: { showTable: val } })}
        />
        <div className='flex-1'>
          <FadeBetween value={showTable}>
            <ResultsTable results={rows} />
            {isReady ? <WidgetAdapter /> : renderWidgetWarning}
          </FadeBetween>
        </div>
      </div>
      :
      renderWidgetWarning
  )
}

export default WidgetView
