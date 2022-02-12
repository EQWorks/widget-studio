import React, { useEffect, useState, useMemo } from 'react'

import { Icons, getTailwindConfigColor, Loader, makeStyles } from '@eqworks/lumen-labs'

import LabeledToggle from '../components/labeled-toggle'
import FadeBetween from '../components/fade-between'
import ResultsTable from './table'
import { useStoreState, useStoreActions } from '../store'
import WidgetAdapter from './adapter'
import modes from '../constants/modes'
import CustomButton from '../components/custom-button'
import WidgetMeta from './meta'
import CustomToggle from '../components/custom-toggle'
import types from '../constants/types'
import { dataSourceTypes } from '../constants/data-source'


const useStyles = ({ mode, tableExpanded, type }) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: getTailwindConfigColor('neutral-100'),
        overflow: 'hidden',
      },
      innerContainer: {
        margin: '2rem',
        overflow: 'hidden',
        flex: 1,
        background: 'white',
        padding: type === types.MAP ? 0 : '1.25rem',
      },
      tableContainer: {
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem',
        height: tableExpanded ? '30rem' : '2.85rem',
        transition: 'all 0.3s',
        background: getTailwindConfigColor('secondary-50'),
      },
      tableHeader: {
        height: '2.85rem',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        fontWeight: 700,
        color: getTailwindConfigColor('secondary-800'),
        borderBottom: `1px solid ${getTailwindConfigColor('secondary-300')}`,
      },
      tableTitle: {
        flex: 1,
      },
      buttonLabel: {
        fontWeight: '400',
        textTransform: 'uppercase',
        fontSize: '0.9rem',
        margin: '0 0.5rem',
        color: getTailwindConfigColor('secondary-500'),
        fontFamily: 'mono',
      },
      tableContentContainer: {
        height: tableExpanded ? '100%' : '0 !important',
        overflow: 'auto',
        padding: '1rem',
      },
      tableCollapseButton: {
        background: `${getTailwindConfigColor('secondary-300')} !important`,
        '& svg': {
          fill: `${getTailwindConfigColor('secondary-800')} !important`,
        },
        '&:hover': {
          '& svg': {
            fill: `${getTailwindConfigColor('secondary-900')} !important`,
          },
          background: `${getTailwindConfigColor('secondary-400')} !important`,
        },
        width: '1.5rem',
        height: '1.5rem',
        fontSize: '1.6rem !important',
        lineHeight: '1.2rem !important',
        fontWeight: 700,
        display: 'flex !important',
        justifyContent: 'center !important',
        alignItems: 'center !important',
      },
      table: {
        border: `2px solid ${getTailwindConfigColor('secondary-300')}`,
        borderRadius: '0.425rem',
        fontSize: '0.78rem',
        marginTop: '1rem',
      },
      tableExtra: {
        display: 'flex',
        '> *': {
          background: getTailwindConfigColor('secondary-100'),
          border: `2px solid ${getTailwindConfigColor('secondary-300')}`,
          borderRadius: '0.425rem',
          padding: '0.75rem',
          fontSize: '0.78rem',
          color: getTailwindConfigColor('secondary-800'),
          marginRight: '1rem',
          '&:last-child': {
            marginRight: 0,
          },
        },
      },
      tableDisplayControls: {
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        fontSize: '0.85rem',
      },
      tableRawToggle: {
        fontSize: '0.85rem !important',
      },
    }
    : {
      outerContainer: {
        padding: '1rem',
        paddingTop: '0.25rem',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
    }
)

const WidgetView = () => {
  // store actions
  const update = useStoreActions((actions) => actions.update)

  // widget state
  const type = useStoreState((state) => state.type)
  const rows = useStoreState((state) => state.rows)
  const isReady = useStoreState((state) => state.isReady)
  const transformedData = useStoreState((state) => state.transformedData)
  const domain = useStoreState((state) => state.domain)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const tableShowsRawData = useStoreState((state) => state.ui.tableShowsRawData)
  const showTable = useStoreState((state) => state.ui.showTable)
  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)
  const dataSourceError = useStoreState((state) => state.ui.dataSourceError)

  const [tableExpanded, setTableExpanded] = useState(false)
  const [autoExpandedTable, setAutoExpandedTable] = useState(false)

  const classes = useStyles({ mode, tableExpanded, type })

  // descriptive message to display when the data source is still loading
  const dataSourceLoadingMessage = useMemo(() => (
    dataSourceType && dataSourceID ?
      `Loading ${dataSourceType.charAt(0).toLowerCase() + dataSourceType.slice(1)} ${dataSourceID}`
      :
      'Loading'
  ), [dataSourceType, dataSourceID])

  // auto-expand/collapse the table when viz readiness changes
  useEffect(() => {
    if (!isReady && dataReady) {
      setTableExpanded(true)
      setAutoExpandedTable(true)
    } else if (autoExpandedTable) {
      setTableExpanded(false)
      setAutoExpandedTable(false)
    }
  }, [autoExpandedTable, isReady, dataReady])

  // descriptive messages to display when the data source is finished loading but the widget cannot yet be rendered
  const widgetWarning = useMemo(() => {
    let primary, secondary
    if (!dataSourceID || !dataSourceType) {
      primary = 'Please select a data source.'
    } else if (dataSourceError) {
      primary = 'Something went wrong.'
      secondary = `${dataSourceError}`
    } else if (!rows.length) {
      primary = 'Sorry, this data is empty.'
    } else if (!type) {
      primary = 'Select a widget type.'
    } else if (!domain?.value || !renderableValueKeys?.length) {
      primary = 'Select columns and configure your widget.'
    } else if (!transformedData?.length) {
      primary = 'This configuration resulted in an empty dataset.'
      secondary = 'Try adjusting your filters.'
    }
    if (!secondary && dataSourceType && dataSourceType !== dataSourceTypes.MANUAL) {
      secondary = `Successfully loaded ${dataSourceType.charAt(0).toLowerCase() + dataSourceType.slice(1)} ${dataSourceID}`
    }
    return { primary, secondary }
  }, [dataSourceError, dataSourceID, dataSourceType, domain?.value, renderableValueKeys?.length, rows.length, transformedData?.length, type])

  const renderWidgetWarning = (
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
  )

  const renderVisualization = isReady && dataReady ? <WidgetAdapter /> : renderWidgetWarning

  return (
    <div className={classes.outerContainer}>
      {
        mode === modes.EDITOR
          ? <>
            <div className={classes.innerContainer}>
              {renderVisualization}
            </div>
            <div
              className={classes.tableContainer}
            >
              <div className={classes.tableHeader}>
                <span className={classes.tableTitle}>
                  Data Table:
                </span>
                <CustomButton
                  classes={{
                    button: classes.tableCollapseButton,
                  }}
                  type='secondary'
                  onClick={() => setTableExpanded(!tableExpanded)}
                >
                  {
                    tableExpanded
                      ? <Icons.Remove size='sm' />
                      : <Icons.Add size='sm' />
                  }
                </CustomButton>
              </div>
              <div className={classes.tableContentContainer}>
                <div className={classes.tableExtra}>
                  <WidgetMeta />
                  <div className={classes.tableDisplayControls}>
                    Display:
                    <CustomToggle
                      classes={{
                        label: classes.tableRawToggle,
                      }}
                      value={tableShowsRawData}
                      label='Raw Data'
                      onChange={() => update({ ui: { tableShowsRawData: !tableShowsRawData } })}
                    />
                  </div>
                </div>
                <div className={classes.table}>
                  <ResultsTable results={tableShowsRawData ? rows : transformedData} />
                </div>
              </div>
            </div>
          </>
          : <>
            <LabeledToggle
              className='flex-0 mt-3 ml-5'
              labels={['widget', 'table']}
              icons={[Icons.DashboardLayout, Icons.Table]}
              value={showTable}
              update={(val) => update({ ui: { showTable: val } })}
            />
            <div className='flex-1'>
              <FadeBetween value={showTable}>
                <ResultsTable results={rows} />
                {renderVisualization}
              </FadeBetween>
            </div>
          </>
      }
    </div>
  )
}

export default WidgetView
