import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import clsx from 'clsx'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import modes from './constants/modes'
import { useStoreState, useStoreActions } from './store'
import withQueryClient from './util/with-query-client'
import withStore from './util/with-store'
import WidgetView from './view'
import './styles/index.css'
import QLModeControls from './controls/ql-mode'
import EditorModeControls from './controls/editor-mode'
import WidgetTitleBar from './view/title-bar'
import CustomGlobalToast from './components/custom-global-toast'
import useTransformedData from './hooks/use-transformed-data'
import { dataSourceTypes } from './constants/data-source'
import CustomModal from './components/custom-modal'


const commonClasses = {
  innerContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    alignItems: 'stretch',
  },
}

const useStyles = (mode = modes.EDITOR) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        position: 'relative',
        backgroundColor: getTailwindConfigColor('secondary-50'),
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        minHeight: '100%',
      },
      ...commonClasses,
    }
    : {
      outerContainer: {
        position: 'relative',
        overflow: 'visible',
        backgroundColor: getTailwindConfigColor('secondary-50'),
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: '0.125rem',
        borderWidth: '2px',
      },
      ...commonClasses,
    }
)

const Widget = ({
  id: _id,
  mode: _mode,
  staticData,
  wl,
  cu,
  rows: _rows,
  columns: _columns,
  className,
  allowOpenInEditor,
  onOpenInEditor,
  onInsightsDataRequired,
  saveWithInsightsData,
  dataProviderResponse,
  onWidgetRender,
  // temporary:
  filters,
  executionID,
  config: _config,
  sampleData,
  sampleConfigs,
  mapTooltipLabelTitles,
}) => {
  const classes = useStyles(_mode)

  // easy-peasy actions
  const loadData = useStoreActions((actions) => actions.loadData)
  const loadConfig = useStoreActions(actions => actions.loadConfig)
  const loadConfigByID = useStoreActions(actions => actions.loadConfigByID)
  const update = useStoreActions(actions => actions.update)

  // common state
  const id = useStoreState((state) => state.id)
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const userValueFilter = useStoreState((state) => state.userValueFilter)

  // ui state
  const mode = useStoreState(state => state.ui.mode)
  const baseMode = useStoreState(state => state.ui.baseMode)
  // const onWidgetRender = useStoreState(state => state.ui.onWidgetRender)

  // update state for case when we use InsightsDataProvider
  useEffect(() => {
    if (dataSourceType === dataSourceTypes.INSIGHTS_DATA) {
      const { dataReady, dataSourceLoading, dataSourceError } = dataProviderResponse
      update({
        dataReady,
        ui: {
          dataSourceLoading,
          dataSourceError,
        },
      })
    }
  }, [dataSourceType, dataProviderResponse, update])

  useTransformedData()

  const initDone = useMemo(() => Boolean(mode), [mode])

  useEffect(() => {
    if (filters) {
      update({ propFilters: [...userValueFilter, ...filters] })
    }
  }, [filters, userValueFilter, update])

  // on first load,
  useEffect(() => {
    // validate mode prop
    const validatedBaseMode = Object.values(modes).find(v => v === _mode)
    if (!validatedBaseMode) {
      throw new Error(`Invalid widget mode: ${_mode}. Valid modes are the strings ${Object.values(modes)}.`)
    }
    const dev = Boolean(sampleData && sampleConfigs)
    // dispatch state
    update({
      sampleData,
      sampleConfigs,
      dev,
      wl,
      cu,
      ui: {
        ...(!initDone && { mode: validatedBaseMode }),
        ...(validatedBaseMode === modes.QL && { showTable: true }),
        baseMode: validatedBaseMode,
        staticData,
      },
      saveWithInsightsData,
      mapTooltipLabelTitles,
    })
    // use manually passed data if available
    if (_rows?.length && _columns?.length) {
      update({
        rows: _rows,
        columns: _columns,
        ui: { dataSourceLoading: false },
        ...(dataSourceType !== dataSourceTypes.INSIGHTS_DATA && {
          dataSource: {
            type: dataSourceTypes.MANUAL,
          },
        }
        ),
      })
    }
    // use executionID passed from QL if available
    if (executionID !== -1) {
      update({
        dataSource: { type: dataSourceTypes.EXECUTIONS, id: executionID },
      })
    } else if (_config) {
      loadConfig(_config)
    }
    // if there is a new widget ID,
    else if (Number(id) !== Number(_id) && _id !== undefined && _id !== null) {
      // fetch/read the config associated with the ID
      loadConfigByID(_id)
    } else if (staticData && validatedBaseMode === modes.EDITOR) {
      // error on incorrect component usage
      throw new Error('Incorrect usage: Widgets in editor mode without an ID cannot have data source control disabled (staticData == true).')
    } else if (validatedBaseMode === modes.VIEW && !id && ((id === undefined || id === null) || (_id === undefined && _id === null))) {
      // error on incorrect component usage
      throw new Error(`Incorrect usage: Widgets in ${validatedBaseMode} mode must have an ID.`)
    }
  }, [filters, _columns, _config, _id, _mode, _rows, cu, executionID, id, initDone, loadConfig, loadConfigByID, sampleConfigs, sampleData, staticData, update, wl, dataSourceType, onInsightsDataRequired, saveWithInsightsData, mapTooltipLabelTitles])

  // load data if source changes
  useEffect(() => {
    if (!staticData && dataSourceType && dataSourceID) {
      if (dataSourceType === dataSourceTypes.INSIGHTS_DATA) {
        onInsightsDataRequired(id, dataSourceID)
      } else if (dataSourceType !== dataSourceTypes.MANUAL) {
        loadData({ type: dataSourceType, id: dataSourceID })
      }
    }
  }, [staticData, loadData, dataSourceType, dataSourceID, onInsightsDataRequired, id])

  useEffect(() => update({ ui: { onWidgetRender } }), [update, onWidgetRender])

  const renderView = (
    <div className={clsx('min-h-0 overflow-hidden flex-1 min-w-0 flex items-stretch', {
      'h-full': mode === modes.VIEW,
    })}>
      <WidgetView />
    </div>
  )

  const renderViewWithControls = () => {
    if (mode === modes.EDITOR) {
      return <EditorModeControls>{renderView}</EditorModeControls>
    }
    if (mode === modes.QL) {
      return <QLModeControls>{renderView}</QLModeControls>
    }
    return renderView
  }

  const renderWidget = (
    <div className={`${classes.outerContainer} ${className}`}>
      <WidgetTitleBar allowOpenInEditor={allowOpenInEditor} onOpenInEditor={onOpenInEditor} />
      <div className={classes.innerContainer}>
        {renderViewWithControls()}
      </div>
      {mode !== modes.COMPACT && <CustomGlobalToast />}
    </div>
  )

  return (
    baseMode !== modes.EDITOR && mode === modes.EDITOR
      ? <CustomModal
        title='Widget Editor'
        onClose={() => update({ ui: { mode: baseMode } })}
      >
        {renderWidget}
      </CustomModal >
      : renderWidget
  )
}

Widget.propTypes = {
  className: PropTypes.string,
  allowOpenInEditor: PropTypes.bool,
  mode: PropTypes.string,
  id: PropTypes.string,
  staticData: PropTypes.bool,
  config: PropTypes.object,
  executionID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sampleData: PropTypes.object,
  sampleConfigs: PropTypes.object,
  wl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cu: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onOpenInEditor: PropTypes.func,
  rows: PropTypes.array,
  columns: PropTypes.array,
  filters: PropTypes.arrayOf(PropTypes.object),
  onInsightsDataRequired: PropTypes.func,
  onWidgetRender: PropTypes.func,
  saveWithInsightsData: PropTypes.bool,
  dataProviderResponse: PropTypes.object,
  mapTooltipLabelTitles: PropTypes.object,
}

Widget.defaultProps = {
  className: '',
  allowOpenInEditor: true,
  mode: modes.VIEW,
  id: undefined,
  staticData: false,
  config: null,
  executionID: -1,
  sampleData: null,
  sampleConfigs: null,
  wl: null,
  cu: null,
  onOpenInEditor: null,
  rows: null,
  columns: null,
  filters: [],
  onInsightsDataRequired: () => {},
  onWidgetRender: () => {},
  saveWithInsightsData: false,
  dataProviderResponse: {},
  mapTooltipLabelTitles: null,
}

export default withQueryClient(withStore(Widget))
