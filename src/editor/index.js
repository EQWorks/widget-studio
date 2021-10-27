import React, { createElement } from 'react'

import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import FilterListIcon from '@material-ui/icons/FilterList'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'

import modes from '../constants/modes'
import { useStoreState, useStoreActions } from '../store'
import WidgetControls from './widget-controls'
import DataSourceControls from './data-source-controls'
import FilterControls from './widget-controls/data-controls/filter-controls'
import styles from '../styles' // TODO fix
import { Button, Icons, Layout } from '@eqworks/lumen-labs'
import { Controls } from '../components/icons'


// put styles in separate file for readability
const useStyles = makeStyles(styles)

const WidgetEditor = () => {

  const classes = useStyles()

  // store actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // data source state
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const showFilterControls = useStoreState((state) => state.ui.showFilterControls)
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
    icon: PropTypes.elementType.isRequired,
  }

  const renderFilterControlsContainer =
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

  return (
    <>
      {
        !staticData &&
        <div className={showDataSourceControls ? classes.dataControlsAlt : classes.hidden}>
          <DataSourceControls />
        </div>
      }

      <Layout className='border border-neutral-100 p-5 row-span-3'>
        <Layout.Header className='flex flex-1 items-center'>
          {
            showWidgetControls &&
            <span className='flex-1 font-bold text-secondary-800'>Controls</span>
          }
          <Button
            variant='borderless'
            className={`border-none ${showWidgetControls ? '' : 'h-full'}`}
            onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
          >
            {
              showWidgetControls
                ? createElement(Icons.Close,
                  {
                    className: 'fill-current text-secondary-500 h-min w-auto',
                    size: 'md',
                  }
                )
                : createElement(Controls,
                  {
                    className: 'h-full stroke-current text-secondary-500 w-5 ',
                    size: 'md',
                  }
                )
            }

          </Button>
          {/* </span> */}
        </Layout.Header>
        <div className={showWidgetControls ? classes.flex : classes.hidden} >
          <WidgetControls />
        </div>
      </Layout>

      {
        mode === modes.EDITOR &&
        <Layout className='border border-neutral-100 p-1 col-span-2'>
          <Layout.Header className='flex flex-1 items-center'>
            {
              showFilterControls
                ? renderFilterControlsContainer
                :
                <IconButton
                  className={classes.wideButton}
                  onClick={() => nestedUpdate({ ui: { showFilterControls: !showFilterControls } })}
                >
                  <FilterListIcon className={classes.wideButton} />
                </IconButton>
            }
          </Layout.Header>
          <div className={showFilterControls ? classes.flex : classes.hidden} >
            <FilterControls />
          </div>
        </Layout>
      }
    </>
  )
}

export default WidgetEditor
