import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import clsx from 'clsx'

import modes from './constants/modes'
import { useStoreState, useStoreActions } from './store'
import withQueryClient from './util/with-query-client'
import withStore from './util/with-store'
import WidgetView from './view'
import WidgetTitleBar from './view/title-bar'
import './styles/index.css'
import WidgetControls from './editor/widget-controls'
import FilterControls from './editor/widget-controls/data-controls/filter-controls'
import CustomGlobalToast from './components/custom-global-toast'


const Widget = ({ id, mode: _mode, staticData }) => {

  // easy-peasy actions
  const loadConfig = useStoreActions(actions => actions.loadConfig)
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // ui state
  const mode = useStoreState(state => state.ui.mode)

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
    <div className='bg-white rounded-sm overflow-hidden flex flex-col items-stretch border-2 border-neutral-100 w-full h-full' >
      <WidgetTitleBar className='flex-initial flex p-4 border-b-2 border-neutral-100 shadow-blue-20' />
      <div className='flex-1 min-h-0 flex flex-row justify-end'>
        <div className={clsx('p-4 pt-1 min-h-0 overflow-auto flex-1 min-w-0 flex items-stretch', {
          'h-full': mode === modes.VIEW,
        })}>
          <WidgetView />
        </div>
        {mode !== modes.VIEW && <WidgetControls />}
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
