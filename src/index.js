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
  muteContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'max(20%, 5rem)',
    zIndex: 102,
    background: 'rgba(100,100,100, 0.3)',
  },
  muteMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    zIndex: 2,
    position: 'absolute',
    background: 'white',
    color: getTailwindConfigColor('secondary-800'),
    borderRadius: '0.4rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    margin: '1rem',
    padding: '2rem 1rem',
    lineHeight: '1.4rem',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '3rem',
    padding: '1rem',
    borderBottom: `solid 1px ${getTailwindConfigColor('neutral-100')}`,
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
  id,
  mode: _mode,
  staticData,
  wl,
  cu,
  className,
  editable,
  // temporary:
  editCallback,
  rows: _rows,
  columns: _columns,
  executionID,
  config: _config,
  sampleData,
  sampleConfigs,
}) => {
  const classes = useStyles(_mode)

  // easy-peasy actions
  const resetWidget = useStoreActions((actions) => actions.resetWidget)
  const loadData = useStoreActions((actions) => actions.loadData)
  const loadConfig = useStoreActions((actions) => actions.loadConfig)
  const loadConfigByID = useStoreActions(actions => actions.loadConfigByID)
  const update = useStoreActions(actions => actions.update)

  // common state
  const dev = useStoreState((state) => state.dev)
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)

  // ui state
  const mode = useStoreState(state => state.ui.mode)

  useTransformedData()

  // on first load,
  useEffect(() => {
    // validate mode prop
    const validatedMode = Object.values(modes).find(v => v === _mode)
    if (!validatedMode) {
      throw new Error(`Invalid widget mode: ${_mode}. Valid modes are the strings ${Object.values(modes)}.`)
    }
    const dev = Boolean(sampleData && sampleConfigs)
    // dispatch state
    update({
      sampleData,
      sampleConfigs,
      id,
      dev,
      wl,
      cu,
      ui: {
        mode: validatedMode,
        staticData,
      },
    })
    if (_rows && _columns) {
      // use manually passed data if available
      resetWidget()
      update({
        rows: _rows,
        columns: _columns,
        dataSource: {
          type:
            mode === modes.QL
              ? dataSourceTypes.EXECUTIONS
              : dataSourceTypes.MANUAL,
          id: executionID,
        },
      })
    } else if (executionID !== -1) {
      // use executionID if available
      update({
        dataSource: { type: dataSourceTypes.EXECUTIONS, id: executionID },
      })
    } else if (_config) {
      loadConfig(_config)
    }
    // if there is a widget ID,
    else if (id !== undefined && id !== null) {
      // fetch/read the config associated with the ID
      loadConfigByID(id)
    } else if (staticData && validatedMode === modes.EDITOR) {
      // error on incorrect component usage
      throw new Error('Incorrect usage: Widgets in editor mode without an ID cannot have data source control disabled (staticData == true).')
    } else if (validatedMode === modes.VIEW) {
      // error on incorrect component usage
      throw new Error(`Incorrect usage: Widgets in ${validatedMode} mode must have an ID.`)
    }
  }, [_columns, _config, _mode, _rows, cu, executionID, id, loadConfig, loadConfigByID, mode, resetWidget, sampleConfigs, sampleData, staticData, update, wl])


  // load data if source changes
  useEffect(() => {
    if (!staticData && !_rows && !_columns && dataSourceType && dataSourceID) {
      loadData({ type: dataSourceType, id: dataSourceID })
    }
  }, [staticData, loadData, dataSourceType, dataSourceID, _rows, _columns])

  const renderView = (
    <div className={clsx('min-h-0 overflow-auto flex-1 min-w-0 flex items-stretch', {
      'h-full': mode === modes.VIEW,
    })}>
      <WidgetView />
    </div>
  )

  const muteMessage = useMemo(() => {
    if (!dev && mode === modes.QL && !(_rows?.length) && !(_columns?.length)) {
      return 'Select an execution to start building a widget.'
    }
    // else if (dataSourceLoading) {
    //   return 'Loading...'
    // }
  }, [_columns?.length, _rows?.length, dev, mode])

  const renderViewWithControls = () => {
    if (mode === modes.EDITOR) {
      return <EditorModeControls>{renderView}</EditorModeControls>
    }
    if (mode === modes.QL) {
      return <QLModeControls>{renderView}</QLModeControls>
    }
    return renderView
  }

  return (
    <div className={`${muteMessage ? classes.muted : ''} ${classes.outerContainer} ${className}`}>
      {/* <div className={classes.titleBar}> */}
      <WidgetTitleBar editable={editable} editCallback={editCallback} />
      {/* </div> */}
      <div className={classes.innerContainer}>
        {renderViewWithControls()}
      </div>
      <CustomGlobalToast />
      {muteMessage && (
        <div className={classes.muteContainer}>
          <div className={classes.muteMessage}>
            {muteMessage}
          </div>
        </div>
      )}
    </div >
  )
}

Widget.propTypes = {
  className: PropTypes.string,
  editable: PropTypes.bool,
  mode: PropTypes.string,
  id: PropTypes.string,
  staticData: PropTypes.bool,
  rows: PropTypes.array,
  columns: PropTypes.array,
  config: PropTypes.object,
  executionID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sampleData: PropTypes.object,
  sampleConfigs: PropTypes.object,
  wl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cu: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  editCallback: PropTypes.func,
}
Widget.defaultProps = {
  className: '',
  editable: true,
  mode: modes.VIEW,
  id: undefined,
  staticData: false,
  rows: null,
  columns: null,
  config: null,
  executionID: -1,
  sampleData: null,
  sampleConfigs: null,
  wl: null,
  cu: null,
  editCallback: null,
}

export default withQueryClient(withStore(Widget))
