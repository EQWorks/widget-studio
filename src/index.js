import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import styles from './styles'
import modes from './constants/modes'
import { useStoreState, useStoreActions } from './store'
import withQueryClient from './util/with-query-client'
import withStore from './util/with-store'
import WidgetEditor from './editor'
import WidgetView from './view'


// put styles in separate file for readability
const useStyles = makeStyles(styles)

const Widget = ({ id, mode: _mode, staticData }) => {

  const classes = useStyles()

  // easy-peasy actions
  const loadConfig = useStoreActions(actions => actions.loadConfig)
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

    // dispatch ui state options
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
  }, [_mode, id, loadConfig, mode, nestedUpdate, staticData])

  return (
    <div className={
      mode === modes.EDITOR
        ? classes.outerContainer
        : mode === modes.VIEW
          ? classes.outerContainerViewMode
          : mode === modes.QL
            ? classes.outerContainerQLMode
            : ''
    }>
      <WidgetView />
      {
        mode !== modes.VIEW &&
        <WidgetEditor />
      }
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
