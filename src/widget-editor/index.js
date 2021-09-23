import React from 'react'

import PropTypes from 'prop-types'
import TocIcon from '@material-ui/icons/Toc'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import SettingsIcon from '@material-ui/icons/Settings'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import CropLandscapeIcon from '@material-ui/icons/CropLandscape'
import SaveIcon from '@material-ui/icons/Save'
import BuildIcon from '@material-ui/icons/Build'
import FilterListIcon from '@material-ui/icons/FilterList'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'

import { useStoreState, useStoreActions } from '../store'
import WidgetControls from './widget-controls'
import ResultsTable from './table'
import DataControls from './data-controls'
import styles from '../styles' // TODO fix
import FilterControls from './widget-controls/filter-controls'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetEditor = props => {

  const classes = useStyles()

  const updateUI = useStoreActions(actions => actions.updateUI)

  // widget configuration state
  const rows = useStoreState((state) => state.rows)
  const dataSource = useStoreState((state) => state.data.source)
  const dataID = useStoreState((state) => state.data.id)
  const dataLoading = useStoreState((state) => state.dataLoading)
  const dataError = useStoreState((state) => state.dataError)

  // editor UI state
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const showFilterControls = useStoreState((state) => state.ui.showFilterControls)
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
              <IconButton
                color='secondary'
                onClick={() => alert('Not implemented')}
                disabled={dataLoading || dataError || !dataSource || !dataID}
              > <SaveIcon /> </IconButton>
              {
                !staticData &&
                <IconButton
                  color='secondary'
                  onClick={() => updateUI({ showDataControls: !showDataControls })}
                > <SettingsIcon /> </IconButton>
              }
              <IconButton
                disabled={dataLoading || dataError || !dataSource || !dataID}
                color='secondary'
                onClick={() => updateUI({ showTable: !showTable }
                )}
              >
                <TocIcon />
              </IconButton>
              <IconButton
                disabled={dataLoading || dataError || !dataSource || !dataID}
                color='secondary'
                onClick={() =>
                  updateUI(showWidgetControls || showFilterControls ?
                    { showWidgetControls: false, showFilterControls: false }
                    :
                    { showWidgetControls: true, showFilterControls: true }
                  )
                }
              >
                {showWidgetControls || showFilterControls ? <CropLandscapeIcon /> : <ArtTrackIcon />}
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
          <WidgetControls />
        </div>
      </div>

      <div className={classes.filterControlsBar}>
        <div className={classes.filterControlsBarTab}>

          {
            showFilterControls ?
              <>
                <Typography
                  className={classes.filterControlsBarTabText}
                  color='textSecondary'
                  variant='subtitle1'
                >
                  Filters
                </Typography>
                <IconButton
                  onClick={() => updateUI({ showFilterControls: !showFilterControls })}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </>
              :
              <IconButton
                className={classes.wideButton}
                onClick={() => updateUI({ showFilterControls: !showFilterControls })}
              >
                <FilterListIcon className={classes.wideButton} />
              </IconButton>
          }
        </div>
        <div className={showFilterControls ? classes.flex : classes.hidden} >
          <FilterControls />
        </div>
      </div>
    </>
  )
}

WidgetEditor.propTypes = {
  children: PropTypes.object,
}

export default WidgetEditor
