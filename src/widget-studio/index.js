import React from 'react'

import PropTypes from 'prop-types'
import TocIcon from '@material-ui/icons/Toc'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import SettingsIcon from '@material-ui/icons/Settings'
import BuildIcon from '@material-ui/icons/Build'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { makeStyles } from '@material-ui/core/styles'
import { useStoreState, useStoreActions } from '../store'

import WidgetControls from './widget-controls'
import ResultsTable from './table'
import DataControls from './data-controls'

import styles from '../styles' // TODO fix

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetStudio = props => {

  const classes = useStyles()

  const updateUI = useStoreActions(actions => actions.updateUI)

  // widget configuration state
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)
  const dataSource = useStoreState((state) => state.data.source)
  const dataID = useStoreState((state) => state.data.id)
  const dataLoading = useStoreState((state) => state.dataLoading)

  // studio UI state
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const showTable = useStoreState((state) => state.ui.showTable)
  const showDataControls = useStoreState((state) => state.ui.showDataControls)
  const staticData = useStoreState((state) => state.ui.staticData)

  return (
    <>
      <div className={classes.navigationSidebar}>
        {
          // something to exit?
          showDataControls || showTable ?
            // show exit button
            <IconButton
              className={classes.tallButton}
              color='secondary'
              onClick={() => {
                updateUI({
                  showTable: false,
                  showDataControls: false
                })
              }} > <HighlightOffIcon /> </IconButton>
            :
            // show sidebar buttons
            <>
              {
                !staticData &&
                <IconButton
                  color='secondary'
                  onClick={() => updateUI({ showDataControls: !showDataControls })}
                > <SettingsIcon /> </IconButton>
              }
              <IconButton
                disabled={dataLoading || !dataSource || !dataID}
                color='secondary'
                onClick={() => updateUI({ showTable: !showTable }
                )}
              >
                <TocIcon />
              </IconButton>
            </>
        }
      </div>

      <div className={showDataControls || showTable ? classes.extras : classes.hidden}>
        <div className={showDataControls ? classes.dataControlsAlt : classes.hidden}>
          {
            !staticData &&
            <DataControls />
          }
        </div>
        <div className={showTable ? null : classes.hidden}>
          <ResultsTable results={rows} />
        </div>
      </div>

      <div className={classes.widgetControlsSidebar}>
        <div className={classes.widgetControlsSidebarTab}>
          <IconButton className={classes.tallButton}
            onClick={() => updateUI({ showWidgetControls: !showWidgetControls })}
          >
            {showWidgetControls ? <KeyboardArrowRightIcon /> : <BuildIcon />}
          </IconButton>
        </div>
        <div className={showWidgetControls ? classes.flex : classes.hidden} >
          <WidgetControls {...{ columns, dataLoading }} />
        </div>
      </div>
    </>
  )
}

WidgetStudio.propTypes = {
  children: PropTypes.object,
}

export default WidgetStudio
