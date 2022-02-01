import React from 'react'

import { Accordion, Icons, Chip, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { Cycle, ArrowExpand, Download, Trash, Undo, Redo } from '../components/icons'
import { useStoreState, useStoreActions } from '../store'
import OverflowTooltip from '../components/overflow-tooltip'
import saveConfig from '../util/save-config'
import CustomButton from '../components/custom-button'
import modes from '../constants/modes'
import EditableTitle from './title-bar/editable-title'


const commonClasses = {
  left: {
    display: 'flex',
    justifyContent: 'start',
  },
  right: {
    display: 'flex',
    justifyContent: 'end',
  },
  item: {
    margin: '0 0.2rem',
    display: 'flex',
    alignItems: 'center',
  },
}

const useStyles = (mode) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        background: getTailwindConfigColor('secondary-50'),
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '3rem',
        padding: '1rem',
        borderBottom: `solid 1px ${getTailwindConfigColor('neutral-100')}`,
      },
      main: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
      },
      ...commonClasses,
    }
    : {
      outerContainer: {
        background: getTailwindConfigColor('secondary-50'),
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '3rem',
        padding: '1rem',
      },
      main: {
        flex: 1,
        display: 'flex',
      },
      ...commonClasses,
    })

const WidgetTitleBar = () => {

  const toast = useStoreActions((actions) => actions.toast)

  // widget state
  const id = useStoreState((state) => state.id)
  const columns = useStoreState((state) => state.columns)
  const rows = useStoreState((state) => state.rows)
  const config = useStoreState((state) => state.config)
  const dev = useStoreState((state) => state.dev)
  const unsavedChanges = true // mocked for now

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const dataSourceName = useStoreState((state) => state.ui.dataSourceName)

  const classes = useStyles(mode)

  const renderDetailItems = (items) =>
    <div className={`w-full grid items-center grid-cols-${items.length} divide-x divide-secondary-300`}>
      {
        items.map(([title, info, hyperlink], i) => {
          const config = 'flex-none whitespace-nowrap min-w-0 font-semibold tracking-wide flex-initial text-xs font-mono bg-secondary-200 p-0.5'
          return (
            <div key={i} className='flex pl-3 pr-3 flex-col overflow-hidden'>
              <span className='m-0 text-xs text-secondary-500 tracking-wider'>
                {`${title}:`}
              </span>
              <OverflowTooltip
                description={info}
                classes={{ content: 'whitespace-nowrap' }}
                position={i === 0 ? 'right' : 'left'}
              >
                <div className='flex-none whitespace-nowrap min-w-0'>
                  {
                    hyperlink
                      ? <a href={hyperlink}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={`${config} font-bold text-primary-500 underline`}
                      > {info} </a>
                      : <span className={`${config} text-secondary-800`}>
                        {info}
                      </span>
                  }
                </div>
              </OverflowTooltip>
            </div >
          )
        }
        )
      }
    </div >

  const renderWidgetMeta =
    <div className='flex bg-transparent p-3'>
      {renderDetailItems([
        ['CREATED DATE', '09/09/09 10:23 AM'],
        ['LAST UPDATED', '09/09/09 10:23 AM'],
        ['DATA VOLUME', dataReady
          ? `${columns.length} columns ${rows.length} rows`
          : '...',
        ],
        ['DATA SOURCE',
          dataReady
            ? `${dataSourceType} ${dataSourceID} ${dataSourceName || ''}`
            : '...',
          'https://www.google.com/search?q=not+implemented',
        ],
      ])}
    </div>

  const renderTitleAndID = (
    <div className={classes.main}>
      <EditableTitle />
      {unsavedChanges &&
        <div className={classes.item}>
          <Chip selectable={false} color='error' >
            unsaved
          </Chip>
        </div>
      }
      <div className={classes.item}>
        <Chip
          color='secondary'
          onClick={e => {
            e.stopPropagation()

            if (window.isSecureContext) {
              navigator.clipboard.writeText(id)
              toast({
                title: 'ID copied to clipboard',
                color: 'success',
              })
            }
          }}
        >
          {`id: ${id}`}
        </Chip>
      </div >
    </div >
  )


  return (
    mode === modes.EDITOR
      ? (
        <div className={classes.outerContainer}>
          <div className={classes.left}>
            <CustomButton
              horizontalMargin
              customVariant={2}
              onClick={() => window.alert('not implemented')}
            >
              <Trash size='sm' />
              reset
            </CustomButton>
            <CustomButton
              horizontalMargin
              customVariant={2}
              onClick={() => window.alert('not implemented')}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                undo
                <Undo size='sm' />
              </div>
            </CustomButton>
            <CustomButton
              horizontalMargin
              customVariant={2}
              onClick={() => window.alert('not implemented')}
            >
              <Redo size='sm' />
              redo
            </CustomButton>
          </div>
          {renderTitleAndID}
          <div className={classes.right}>
            <CustomButton
              horizontalMargin
              customVariant={2}
              onClick={() => window.alert('not implemented')}
            >
              <Cycle size='sm' />
              reload data
            </CustomButton>
            {/* <CustomButton
              horizontalMargin
              cutRight
              customVariant={3}
              onClick={() => window.alert('not implemented')}
            >
              save
            </CustomButton>
            <CustomButton
              horizontalMargin
              cutLeft
              variant='filled'
              // customVariant={3}
              onClick={() => window.alert('not implemented')}
            >
              <Icons.ChevronDown size='sm' />
            </CustomButton> */}
          </div>
        </div>
      )
      : (
        <Accordion color='secondary' className='flex-initial flex p-4 border-b-2 border-neutral-100 shadow-blue-20'>
          <Accordion.Panel
            autoHeight
            color='transparent'
            classes={{
              iconRoot: 'bg-opacity-0 children:text-primary-500',
              icon: 'fill-current text-primary-500',
              header: 'flex items-center children:not-first:flex-1',
            }}
            header={
              <div className='py-2 flex items-center'>
                {renderTitleAndID}
                <div className='flex ml-auto'>
                  {dev && config &&
                    <CustomButton
                      horizontalMargin
                      customVariant={1}
                      onClick={() => saveConfig(config, id)}
                    >
                      <Download size='md' />
                    </CustomButton>}
                  <CustomButton
                    horizontalMargin
                    customVariant={1}
                    onClick={() => window.alert('not implemented')}
                  >
                    EXPORT
                  </CustomButton>
                  <CustomButton
                    horizontalMargin
                    variant='filled'
                    customVariant={1}
                    onClick={() => window.alert('not implemented')}
                  >
                    OPEN IN EDITOR
                    <ArrowExpand size='md' className='stroke-current text-white ml-2' />
                  </CustomButton>
                </div>
              </div>
            }
            ExpandIcon={Icons.ChevronDown}
          >
            {renderWidgetMeta}
          </Accordion.Panel >
        </Accordion >
      )
  )
}

export default WidgetTitleBar
