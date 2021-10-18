import React, { createElement } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import MapIcon from '@material-ui/icons/Map'
import PieChartIcon from '@material-ui/icons/PieChart'
import InsertChartIcon from '@material-ui/icons/InsertChart'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'
import TimelineIcon from '@material-ui/icons/Timeline'
import { Typography } from '@eqworks/lumen-ui'
import { Chip } from '@eqworks/lumen-labs'

import WidgetContent from './content'
import ResultsTable from './table'
import { useStoreState, useStoreActions } from '../store'
import styles from '../styles'


const useStyles = makeStyles(styles)

const icons = {
  map: MapIcon,
  pie: PieChartIcon,
  bar: InsertChartIcon,
  scatter: ScatterPlotIcon,
  line: TimelineIcon
}

const WidgetView = () => {

  const classes = useStyles()

  // store actions
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // widget state
  const type = useStoreState((state) => state.type)
  const title = useStoreState((state) => state.title)
  const columns = useStoreState((state) => state.columns)
  const rows = useStoreState((state) => state.rows)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const showTable = useStoreState((state) => state.ui.showTable)
  const showDataSourceControls = useStoreState((state) => state.ui.showDataSourceControls)
  const dataSourceName = useStoreState((state) => state.ui.dataSourceName)

  return (
    <>
      <div className={classes.widgetTitleBar}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {
            dataReady &&
            <div className={classes.widgetTitleBarItem}>
              <Typography style={{ fontWeight: 600 }} color='textPrimary' variant='h6'>
                {title || 'Untitled'}
              </Typography>
            </div>
          }
          <div className={classes.widgetTitleBarItem}>
            {type && createElement(icons[type], { color: 'secondary' })}
          </div>
          <div className={classes.widgetTitleBarItem}>
            {
              dataReady &&
              <Chip
                color='secondary'
                onClick={() => nestedUpdate({ ui: { showTable: !showTable } })}
              >
                {`${showTable ? 'Hide' : 'View'} Table`}
              </Chip>
            }
          </div>
        </div>

        {
          dataReady &&
          <>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography color='textSecondary' variant='subtitle1'>
                {`${dataSourceType} ${dataSourceID}`}
              </Typography>
              <Typography style={{ fontWeight: 200 }} color='textSecondary' variant='subtitle2'>
                {dataSourceName || ''}
              </Typography>
            </div>
            <Divider orientation='vertical' className={classes.verticalDivider} />
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography style={{ fontStyle: 'italic', fontWeight: 200 }} color='textSecondary' variant='subtitle1'>
                {`${rows.length} rows`}
              </Typography>
              <Typography style={{ fontStyle: 'italic', fontWeight: 200 }} color='textSecondary' variant='subtitle2'>
                {`${columns.length} columns`}
              </Typography>
            </div>
          </>
        }
      </div>
      <div className={showDataSourceControls ? classes.hidden : classes.mainContainer}>
        <div className={!showTable ? classes.hidden : classes.table}>
          <ResultsTable results={rows} />
        </div>
        <div className={showTable ? classes.hidden : classes.widgetContainer}>
          <WidgetContent />
        </div>
      </div>
    </>
  )
}

export default WidgetView
