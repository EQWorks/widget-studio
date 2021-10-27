import React, { useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'
import { Accordion, Icons, TextField, Button, Chip, Loader, Layout } from '@eqworks/lumen-labs'
import { ArrowExpand, EditPen, Download } from '../components/icons'
import OverflowMarquee from '../components/overflow-marquee'

import ResultsTable from './table'
import modes from '../constants/modes'
import { useStoreState, useStoreActions } from '../store'
import styles from '../styles'
import WidgetAdapter from './adapter'


const useStyles = makeStyles(styles)

const WidgetView = () => {

  const classes = useStyles()

  // store actions
  const update = useStoreActions((state) => state.update)
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // widget state
  const id = useStoreState((state) => state.id)
  const type = useStoreState((state) => state.type)
  const title = useStoreState((state) => state.title)
  const columns = useStoreState((state) => state.columns)
  const rows = useStoreState((state) => state.rows)
  const isReady = useStoreState((state) => state.isReady)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const showTable = useStoreState((state) => state.ui.showTable)
  const showDataSourceControls = useStoreState((state) => state.ui.showDataSourceControls)
  const dataSourceLoading = useStoreState((state) => state.ui.dataSourceLoading)
  const dataSourceError = useStoreState((state) => state.ui.dataSourceError)
  const dataSourceName = useStoreState((state) => state.ui.dataSourceName)
  const editingTitle = useStoreState((state) => state.ui.editingTitle)

  // descriptive message to display when the data source is still loading
  const dataSourceLoadingMessage = useMemo(() => (
    dataSourceType && dataSourceID ?
      `Loading ${dataSourceType.charAt(0).toLowerCase() + dataSourceType.slice(1)} ${dataSourceID}`
      :
      'Loading'
  ), [dataSourceType, dataSourceID])

  // descriptive messages to display when the data source is finished loading but the widget cannot yet be rendered
  const widgetWarning = useMemo(() => ({
    primary:
      !dataSourceID || !dataSourceType ? 'Please select a data source.'
        : dataSourceError ? 'Something went wrong.'
          : !rows.length ? 'Sorry, this data is empty.'
            : type ? 'Select columns and configure your widget.'
              : 'Select a widget type.',
    secondary:
      dataSourceError ? `${dataSourceError}`
        : 'Data loaded successfully',
  }), [dataSourceError, dataSourceID, dataSourceType, rows.length, type])

  const [tentativeTitle, setTentativeTitle] = React.useState(title)
  React.useEffect(() => {
    setTentativeTitle(title)
  }, [title])

  const renderButton = (children, onClick, props) =>
    <Button
      classes={{ button: 'ml-2' }}
      variant='borderless'
      size='md'
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>

  const renderIconButton = (Component, onClick, props = {}) =>
    renderButton(<Component size='md' />, onClick, props)

  const renderDetailItems = (items) =>
    <div className={`w-full grid items-center grid-cols-${items.length} divide-x divide-secondary-300`}>
      {
        items.map(([title, info], i) => (
          <div key={i} className='flex pl-3 pr-3 flex-col '>
            <span className='m-0 text-xs text-secondary-500 tracking-wider'>
              {`${title}:`}
            </span>
            <OverflowMarquee >
              <div className='flex-none whitespace-nowrap min-w-0'>
                <span className='flex-initial text-xs font-mono bg-secondary-200 text-secondary-800'>
                  {info}
                </span>
              </div>
            </OverflowMarquee>
          </div>
        )
        )
      }
    </div>


  const renderWidgetMeta =
    <div className='flex bg-transparent p-3'>
      {renderDetailItems([
        ['CREATED DATE', '09/09/09 10:23 AM'],
        ['LAST UPDATED', '09/09/09 10:23 AM'],
        ['DATA VOLUME', dataReady
          ? `${columns.length} columns ${rows.length} rows`
          : '...',
        ],
        ['DATA SOURCE', dataReady
          ? `${dataSourceType} ${dataSourceID} ${dataSourceName || ''}`
          : '...',
        ],
      ])}
    </div>

  const renderWidgetTitle =
    <Accordion color='secondary' className='w-full p-2' >
      <Accordion.Panel
        color='transparent'
        classes={{ icon: 'h-full', header: 'children:not-first:flex-1' }}
        header={
          <div className='flex items-center'>
            {
              editingTitle
                ? <TextField
                  autoFocus
                  size='lg'
                  value={tentativeTitle}
                  onChange={(v) => setTentativeTitle(v)}
                  onBlur={() => {
                    setTentativeTitle(title)
                    nestedUpdate({ ui: { editingTitle: false } })
                  }}
                  onSubmit={(e) => {
                    update({ title: e.target.children[0].children[0].value })
                    nestedUpdate({ ui: { editingTitle: false } })
                    e.preventDefault()
                  }}
                />
                : <span className='text-lg font-bold text-primary-500'>
                  {title || 'Untitled'}
                </span>
            }
            {renderIconButton(EditPen,
              () => nestedUpdate({ ui: { editingTitle: true } }),
              { variant: 'elevated' }
            )}
            {
              id &&
              <Chip classes={{ chip: 'ml-4' }} color='secondary'>
                {`ID: ${id}`}
              </Chip>
            }
            <div className='flex ml-auto'>
              {renderIconButton(Download,
                () => window.alert('not implemented'),
              )}
              {renderButton(<>EXPORT</>,
                () => window.alert('not implemented'),
              )}
              {renderButton(
                <div className='flex items-center'>
                  OPEN IN EDITOR
                  <ArrowExpand size='md' className='stroke-current text-white ml-2' />
                </div>,
                () => window.alert('not implemented'),
                { variant: 'filled' }
              )}
            </div>
          </div>
        }
        ExpandIcon={Icons.ChevronDown}
      >
        {renderWidgetMeta}
      </Accordion.Panel>
    </Accordion>


  return (
    <>
      <Layout className='w-full flex row-span-1 col-span-2 shadow'>
        {renderWidgetTitle}
      </Layout>

      <div className={showDataSourceControls ? classes.hidden : classes.mainContainer}>
        <div className={!showTable
          ? classes.hidden
          : mode !== modes.VIEW
            ? classes.table
            : ''
        }>
          <ResultsTable results={rows} />
        </div>
        <div className={showTable ? classes.hidden : classes.widgetContainer}>
          {

            // config object ready?
            dataReady && isReady ?
              // render widget
              <WidgetAdapter />
              :
              // guide the user to configure the widget
              <div className={classes.warningContainer}>
                {
                  dataSourceLoading ?
                    <div className={classes.loader}>
                      <Loader open classes={{ icon: 'text-primary-700' }} />
                    </div>
                    :
                    <Typography color="textSecondary" variant='h6'>
                      {widgetWarning.primary}
                    </Typography>
                }
                <Typography color="textSecondary" variant='subtitle2'>
                  {
                    dataSourceLoading ?
                      dataSourceLoadingMessage
                      :
                      widgetWarning.secondary
                  }
                </Typography>
              </div>
          }
        </div>
      </div>
    </>
  )
}

export default WidgetView
