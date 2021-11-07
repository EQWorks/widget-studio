import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Button, Accordion, Icons, TextField, Chip } from '@eqworks/lumen-labs'

import { ArrowExpand, EditPen, Download } from '../components/icons'
import { useStoreState, useStoreActions } from '../store'
import OverflowTooltip from '../components/overflow-tooltip'


const WidgetTitleBar = ({ className }) => {

  // store actions
  const update = useStoreActions((state) => state.update)
  const nestedUpdate = useStoreActions((state) => state.nestedUpdate)

  // widget state
  const id = useStoreState((state) => state.id)
  const title = useStoreState((state) => state.title)
  const columns = useStoreState((state) => state.columns)
  const rows = useStoreState((state) => state.rows)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const dataSourceName = useStoreState((state) => state.ui.dataSourceName)
  const editingTitle = useStoreState((state) => state.ui.editingTitle)

  const [tentativeTitle, setTentativeTitle] = useState(title)
  useEffect(() => {
    setTentativeTitle(title)
  }, [title])

  const renderButton = (children, onClick, props) =>
    <Button
      classes={{ button: 'outline-none focus:outline-none ml-2 uppercase p-1.5 py-1 tracking-widest' }}
      type='primary'
      variant='borderless'
      size='md'
      onClick={e => {
        e.stopPropagation()
        onClick(e)
      }}
      {...props}
    >
      {children}
    </Button>

  const renderIconButton = (Component, onClick, props = {}) =>
    renderButton(<Component size='md' />, onClick, props)

  const renderDetailItems = (items) =>
    <div className={`w-full grid items-center grid-cols-${items.length} divide-x divide-secondary-300`}>
      {
        items.map(([title, info, hyperlink], i) => {
          const config = 'flex-none whitespace-nowrap min-w-0 font-semibold tracking-wide flex-initial text-xs font-mono bg-secondary-200 p-0.5'
          return (
            <div key={i} className='flex pl-3 pr-3 flex-col '>
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

  const renderWidgetTitle =
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
      : <>
        <span className='text-lg font-bold text-primary-500'>
          {title || 'Untitled'}
        </span>
        {renderButton(
          <EditPen
            size="md"
            className='fill-current text-secondary-600'
          />,
          () => nestedUpdate({ ui: { editingTitle: true } }),
          { className: 'px-4 border-none', type: 'secondary' }
        )}
      </>

  return (
    <Accordion color='secondary' className={className}>
      <Accordion.Panel
        autoHeight
        color='transparent'
        classes={{
          iconRoot: 'bg-opacity-0 children:text-primary-500',
          icon: 'fill-current text-primary-500',
          header: 'flex items-center children:not-first:flex-1',
        }}
        header={
          <div className='flex items-center'>
            {renderWidgetTitle}
            {
              id &&
              <Chip classes={{ chip: 'text-secondary-600 bg-secondary-300 py-0.5 px-2 rounded-md uppercase' }} color='secondary'>
                {`id: ${id}`}
              </Chip>
            }
            <div className='flex ml-auto'>
              {renderIconButton(Download,
                () => window.alert('not implemented'),
              )}
              {renderButton(<>export</>,
                () => window.alert('not implemented'),
              )}
              {renderButton(
                <div className='flex items-center'>
                  open in editor
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
  )
}

WidgetTitleBar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
WidgetTitleBar.defaultProps = {
  className: '',
}

export default WidgetTitleBar
