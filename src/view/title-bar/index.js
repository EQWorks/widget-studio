import React from 'react'

import { Accordion, Icons, Chip, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { Cycle, ArrowExpand, Download, Trash, Undo, Redo } from '../../components/icons'
import { useStoreState, useStoreActions } from '../../store'
import saveConfig from '../../util/save-config'
import CustomButton from '../../components/custom-button'
import modes from '../../constants/modes'
import EditableTitle from './editable-title'
import WidgetMeta from '../meta'


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
      metaContainer: {
        background: 'transparent',
        padding: '0.75rem',
      },
      ...commonClasses,
    })

const WidgetTitleBar = () => {
  const toast = useStoreActions((actions) => actions.toast)
  const resetWidget = useStoreActions((actions) => actions.resetWidget)
  const loadData = useStoreActions((actions) => actions.loadData)

  // widget state
  const dataSource = useStoreState((state) => state.dataSource)
  const id = useStoreState((state) => state.id)
  const config = useStoreState((state) => state.config)
  const dev = useStoreState((state) => state.dev)
  const unsavedChanges = true // mocked for now

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const classes = useStyles(mode)

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

  const renderDownloadConfigButton = (
    dev && config &&
    <CustomButton
      horizontalMargin
      onClick={() => saveConfig(config, id)}
    >
      <Download size='md' />
    </CustomButton>
  )

  return (
    mode === modes.EDITOR
      ? (
        <div className={classes.outerContainer}>
          <div className={classes.left}>
            <CustomButton
              horizontalMargin
              variant='outlined'
              onClick={resetWidget}
              endIcon={<Trash size='sm' />}
            >
              reset
            </CustomButton>
            <CustomButton
              horizontalMargin
              variant='outlined'
              onClick={() => window.alert('not implemented')}
              endIcon={<Undo size='sm' />}
            >
              undo
            </CustomButton>
            <CustomButton
              horizontalMargin
              variant='outlined'
              onClick={() => window.alert('not implemented')}
              startIcon={<Redo size='sm' />}
            >
              redo
            </CustomButton>
          </div>
          {renderTitleAndID}
          <div className={classes.right}>
            {renderDownloadConfigButton}
            <CustomButton
              horizontalMargin
              variant='outlined'
              onClick={() => loadData(dataSource)}
            >
              <Cycle size='sm' />
              reload data
            </CustomButton>
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
                <div className='flex items-stretch ml-auto'>
                  {renderDownloadConfigButton}
                  <CustomButton
                    horizontalMargin
                    onClick={() => window.alert('not implemented')}
                  >
                    EXPORT
                  </CustomButton>
                  <CustomButton
                    horizontalMargin
                    variant='filled'
                    onClick={() => window.alert('not implemented')}
                    endIcon={<ArrowExpand size='md' />}
                  >
                    OPEN IN EDITOR
                  </CustomButton>
                </div>
              </div>
            }
            ExpandIcon={Icons.ChevronDown}
          >
            <div className={classes.metaContainer}>
              <WidgetMeta />
            </div>
          </Accordion.Panel >
        </Accordion >
      )
  )
}

export default WidgetTitleBar
