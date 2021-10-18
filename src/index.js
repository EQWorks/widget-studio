import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import styles from './styles'
import { useStoreActions } from './store'
import withQueryClient from './util/with-query-client'
import withStore from './util/with-store'
import WidgetEditor from './editor'
import WidgetView from './view'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const Widget = ({ id, editor, staticData }) => {

  const classes = useStyles()

  // easy-peasy actions
  const loadConfig = useStoreActions(actions => actions.loadConfig)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // on first load,
  useEffect(() => {
    // dispatch staticData prop
    nestedUpdate({ ui: { staticData } })
    // check for invalid component usage
    if (id == undefined || id == null) {
      if (staticData || !editor) {
        throw new Error('Incorrect usage: Widgets must either receive an id or have editor features and data control enabled.')
      }
    } else {
      // fetch/read the config associated with the widget ID
      loadConfig(id)
    }
  }, [id, staticData, editor, nestedUpdate, loadConfig])

  return (
    <div className={editor ? classes.outerContainer : classes.outerContainerNoEditor}>
      <WidgetView />
      {editor && <WidgetEditor />}
    </div >
  )
}

Widget.propTypes = {
  editor: PropTypes.bool,
  id: PropTypes.string,
  staticData: PropTypes.bool,
}
Widget.defaultProps = {
  editor: false,
  id: undefined,
  staticData: false,
}

export default withQueryClient(withStore(Widget))
