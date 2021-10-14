import React, { createElement } from 'react'

import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import SettingsIcon from '@material-ui/icons/Settings'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import CropLandscapeIcon from '@material-ui/icons/CropLandscape'
import SaveIcon from '@material-ui/icons/Save'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import ShareIcon from '@material-ui/icons/Share'
import BuildIcon from '@material-ui/icons/Build'
import FilterListIcon from '@material-ui/icons/FilterList'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'

import { useStoreState, useStoreActions } from '../store'
import WidgetControls from './widget-controls'
import DataSourceControls from './data-source-controls'
import FilterControls from './widget-controls/data-controls/filter-controls'
import styles from '../styles' // TODO fix

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetEditor = () => {

  const classes = useStyles()

  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // editor UI state
  const dataReady = useStoreState((state) => state.dataReady)
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const showFilterControls = useStoreState((state) => state.ui.showFilterControls)
  const showTable = useStoreState((state) => state.ui.showTable)
  const showDataSourceControls = useStoreState((state) => state.ui.showDataSourceControls)
  const staticData = useStoreState((state) => state.ui.staticData)

  const DefaultSidebarButton = ({ onClick, icon }) =>
    <IconButton
      disabled={!dataReady}
      color='secondary'
      onClick={onClick}
    >
      {createElement(icon)}
    </IconButton>

  DefaultSidebarButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.elementType.isRequired
  }

  return (
    <>
      <div className={classes.navigationSidebar}>
        {
          // something to exit?
          showDataSourceControls || showTable ?
            // show exit button
            <IconButton
              className={classes.tallButton}
              color='secondary'
              onClick={() => {
                nestedUpdate({
                  ui: {
                    showTable: false,
                    showDataSourceControls: false
                  }
                })
              }} > <HighlightOffIcon /> </IconButton>
            :
            // show sidebar buttons
            <>
              <DefaultSidebarButton
                onClick={() => alert('Not implemented')}
                icon={SaveIcon}
              />
              {
                !staticData &&
                <IconButton
                  color='secondary'
                  onClick={() => nestedUpdate({ ui: { showDataSourceControls: !showDataSourceControls } })}
                >
                  <SettingsIcon />
                </IconButton>
              }
              <DefaultSidebarButton
                onClick={() =>
                  nestedUpdate(showWidgetControls || showFilterControls ?
                    { ui: { showWidgetControls: false, showFilterControls: false } }
                    :
                    { ui: { showWidgetControls: true, showFilterControls: true } }
                  )
                }
                icon={showWidgetControls || showFilterControls ? CropLandscapeIcon : ArtTrackIcon}
              />
              <DefaultSidebarButton
                onClick={() => alert('Not implemented')}
                icon={DownloadIcon}
              />
              <DefaultSidebarButton
                onClick={() => alert('Not implemented')}
                icon={ShareIcon}
              />
            </>
        }
      </div>

      {
        !staticData &&
        <div className={showDataSourceControls ? classes.dataControlsAlt : classes.hidden}>
          <DataSourceControls />
        </div>
      }

      <div className={classes.widgetControlsSidebar}>
        <div className={classes.widgetControlsSidebarTab}>
          <IconButton className={classes.tallButton}
            onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
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
                  onClick={() => nestedUpdate({ ui: { showFilterControls: !showFilterControls } })}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </>
              :
              <IconButton
                className={classes.wideButton}
                onClick={() => nestedUpdate({ ui: { showFilterControls: !showFilterControls } })}
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

export default WidgetEditor
