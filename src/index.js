import React, { useEffect } from 'react'
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
import FilterControls from './controls/editor-mode/components/filter-controls'
import WidgetTitleBar from './view/title-bar'
import CustomGlobalToast from './components/custom-global-toast'
import useTransformedData from './hooks/use-transformed-data'

import './styles/fonts.css'


const useStyles = (mode = modes.EDITOR) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        overflow: 'hidden',
        backgroundColor: getTailwindConfigColor('secondary-50'),
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      },
    }
    : {
      outerContainer: {
        overflow: 'visible',
        backgroundColor: getTailwindConfigColor('secondary-50'),
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: '0.125rem',
        borderWidth: '2px',
      },
    }
)



const Widget = ({ id, mode: _mode, staticData }) => {

  const classes = useStyles(_mode)

  // easy-peasy actions
  const loadConfig = useStoreActions(actions => actions.loadConfig)
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // ui state
  const mode = useStoreState(state => state.ui.mode)

  const transformedData = useTransformedData()
  useEffect(() => {
    update({ transformedData })
  }, [transformedData, update])

  // on first load,
  useEffect(() => {
    // validate mode prop
    const validatedMode = Object.values(modes).find(v => v === _mode)
    if (!validatedMode) {
      throw new Error(`Invalid widget mode: ${_mode}. Valid modes are the strings ${modes}.`)
    }

    // dispatch state
    update({ id })
    nestedUpdate({ ui: { mode: validatedMode, staticData } })

    // if there is a widget ID,
    if (id !== undefined && id !== null) {
      // fetch/read the config associated with the ID
      loadConfig(id)
    } else if (staticData && validatedMode === modes.EDITOR) {
      // error on incorrect component usage
      throw new Error('Incorrect usage: Widgets in editor mode without an ID cannot have data source control disabled (staticData == true).')
    } else if (validatedMode === modes.VIEW) {
      // error on incorrect component usage
      throw new Error(`Incorrect usage: Widgets in ${validatedMode} mode must have an ID.`)
    }
  }, [_mode, id, loadConfig, mode, update, nestedUpdate, staticData])

  return (
    <div className={classes.outerContainer}>
      <WidgetTitleBar className='flex-initial flex p-4 border-b-2 border-neutral-100 shadow-blue-20' />
      <div className='flex-1 min-h-0 flex flex-row justify-end'>
        <div className={clsx('p-4 pt-1 min-h-0 overflow-auto flex-1 min-w-0 flex items-stretch', {
          'h-full': mode === modes.VIEW,
        })}>
          <WidgetView />
        </div>
        {mode === modes.QL && <QLModeControls />}
        {mode === modes.EDITOR && <EditorModeControls />}
      </div>
      {mode === modes.EDITOR &&
        <div className='flex-0'>
          <FilterControls />
        </div>
      }
      <CustomGlobalToast />
    </div >
  )
}

Widget.propTypes = {
  mode: PropTypes.string,
  id: PropTypes.string,
  staticData: PropTypes.bool,
}
Widget.defaultProps = {
  mode: modes.VIEW,
  id: undefined,
  staticData: false,
}

export default withQueryClient(withStore(Widget))
