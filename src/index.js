import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import clsx from 'clsx'
import { Modal, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

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
      modal: {
        width: '100% !important',
        height: '100% !important',
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
  className,
  allowOpenInEditor,
  onOpenInEditor,
  // temporary:
  executionID,
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
  const id = useStoreState((state) => state.id)
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)

  // ui state
  const mode = useStoreState(state => state.ui.mode)
  const baseMode = useStoreState(state => state.ui.baseMode)

  useTransformedData()

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
        ...(!mode && { mode: validatedBaseMode }),
        baseMode: validatedBaseMode,
        staticData,
      },
    })
    if (executionID !== -1) {
      // use executionID if available
      update({
        dataSource: { type: dataSourceTypes.EXECUTIONS, id: executionID },
      })
    }
    // if there is a widget ID,
    else if ((id === undefined || id === null) && (_id !== undefined && _id !== null)) {
      // fetch/read the config associated with the ID
      loadConfigByID(_id)
    } else if (staticData && validatedBaseMode === modes.EDITOR) {
      // error on incorrect component usage
      throw new Error('Incorrect usage: Widgets in editor mode without an ID cannot have data source control disabled (staticData == true).')
    } else if (validatedBaseMode === modes.VIEW && !id && ((id === undefined || id === null) || (_id === undefined && _id === null))) {
      // error on incorrect component usage
      throw new Error(`Incorrect usage: Widgets in ${validatedBaseMode} mode must have an ID.`)
    }
  }, [_id, _mode, cu, executionID, id, loadConfigByID, mode, sampleConfigs, sampleData, staticData, update, wl])


  // load data if source changes
  useEffect(() => {
    if (!staticData && dataSourceType && dataSourceID) {
      loadData({ type: dataSourceType, id: dataSourceID })
    }
  }, [staticData, loadData, dataSourceType, dataSourceID])

  const renderView = (
    <div className={clsx('min-h-0 overflow-auto flex-1 min-w-0 flex items-stretch', {
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
      <WidgetTitleBar allowOpenInEditor={allowOpenInEditor} openInEditor={onOpenInEditor} />
      <div className={classes.innerContainer}>
        {renderViewWithControls()}
      </div>
      <CustomGlobalToast />
    </div>
  )

  return (
    baseMode !== modes.EDITOR && mode === modes.EDITOR
      ? <Modal
        open
        classes={{
          container: classes.modal,
          main: classes.modal,
          content: classes.modal,
        }}
        closeModal={() => update({ ui: { mode: baseMode } })}
      >
        <Modal.Header >
              Widget Editor
        </Modal.Header >
        <Modal.Content>
          {renderWidget}
        </Modal.Content>
      </Modal>
      : renderWidget
  )
}

Widget.propTypes = {
  className: PropTypes.string,
  allowOpenInEditor: PropTypes.bool,
  mode: PropTypes.string,
  id: PropTypes.string,
  staticData: PropTypes.bool,
  executionID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sampleData: PropTypes.object,
  sampleConfigs: PropTypes.object,
  wl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cu: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onOpenInEditor: PropTypes.func,
}
Widget.defaultProps = {
  className: '',
  allowOpenInEditor: true,
  mode: modes.VIEW,
  id: undefined,
  staticData: false,
  executionID: -1,
  sampleData: null,
  sampleConfigs: null,
  wl: null,
  cu: null,
  onOpenInEditor: null,
}

export default withQueryClient(withStore(Widget))
