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
import styles from '../styles' // TODO fix
import { FilterControls } from './data-controls'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetEditor = () => {

  const classes = useStyles()

  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // widget configuration state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)

  // editor UI state
  const dataSourceLoading = useStoreState((state) => state.editorUI.dataSourceLoading)
  const dataSourceError = useStoreState((state) => state.editorUI.dataSourceError)
  const showWidgetControls = useStoreState((state) => state.editorUI.showWidgetControls)
  const showFilterControls = useStoreState((state) => state.editorUI.showFilterControls)
  const showTable = useStoreState((state) => state.editorUI.showTable)
  const showDataSourceControls = useStoreState((state) => state.editorUI.showDataSourceControls)
  const staticData = useStoreState((state) => state.editorUI.staticData)

  const DefaultSidebarButton = ({ onClick, icon }) =>
    <IconButton
      disabled={dataSourceLoading || dataSourceError || !dataSourceType || !dataSourceID}
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
                  editorUI: {
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
                  onClick={() => nestedUpdate({ editorUI: { showDataSourceControls: !showDataSourceControls } })}
                >
                  <SettingsIcon />
                </IconButton>
              }
              <DefaultSidebarButton
                onClick={() =>
                  nestedUpdate(showWidgetControls || showFilterControls ?
                    { editorUI: { showWidgetControls: false, showFilterControls: false } }
                    :
                    { editorUI: { showWidgetControls: true, showFilterControls: true } }
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

      <div className={showDataSourceControls ? classes.extras : classes.hidden}>
        <div className={showDataSourceControls ? classes.dataControlsAlt : classes.hidden}>
          {
            !staticData &&
            <DataSourceControls />
          }
        </div>
      </div>

      <div className={classes.widgetControlsSidebar}>
        <div className={classes.widgetControlsSidebarTab}>
          <IconButton className={classes.tallButton}
            onClick={() => nestedUpdate({ editorUI: { showWidgetControls: !showWidgetControls } })}
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
                  onClick={() => nestedUpdate({ editorUI: { showFilterControls: !showFilterControls } })}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </>
              :
              <IconButton
                className={classes.wideButton}
                onClick={() => nestedUpdate({ editorUI: { showFilterControls: !showFilterControls } })}
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
