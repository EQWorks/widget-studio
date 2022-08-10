import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Accordion, Icons, Chip, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import saveConfig from '../../util/save-config'
import CustomButton from '../../components/custom-button'
import modes from '../../constants/modes'
import EditableTitle from './editable-title'
import WidgetMeta from '../meta'
import EditableSubtitle from './editable-subtitle'


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
  squareButton: {
    margin: '0 0.357rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    marginLeft: '0.357rem',
    display: 'flex',
    alignItems: 'stretch',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  compactOverlay: {
    position: 'relative',
    minHeight: '0.5rem',

    '& .showTitleBarArrow-container': {
      position: 'absolute',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottom: `solid 1px ${getTailwindConfigColor('neutral-100')}`,
      cursor: 'pointer',
      zIndex: 1000,
    },
  },
}

const useStyles = ({ mode, allowOpenInEditor, showTitleBar }) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
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
      editButton: {
        marginLeft: '0.357rem',
        width: '100px',
      },
      ...commonClasses,
    }
    : mode === modes.COMPACT ? {
      outerContainer: {
        fontSize: '0.9rem',
        color: getTailwindConfigColor('secondary-800'),
        fontWeight: 600,
        borderBottom: `solid 1px ${getTailwindConfigColor('neutral-100')}`,
        padding: '0.4rem 0.8rem',
        display: showTitleBar ? 'flex' : 'none',
        alignItems: 'center',

        '& .compact-container': {
          flex: 1,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',

          '& .title-span': {
            fontSize: '1.125rem',
            color: getTailwindConfigColor('secondary-900'),
            letterSpacing: '0.016rem',
          },
        },
      },
      editButton: {
        marginLeft: '0.357rem',
        transition: 'opacity 0.3s, visibility 0.3s',
        transitionDelay: 'visibility 0.4s',
        opacity: + allowOpenInEditor,
        ...(!allowOpenInEditor && { visibility: 'hidden' }),
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
        editButton: {
          marginLeft: '0.357rem',
          transition: 'opacity 0.3s, visibility 0.3s',
          transitionDelay: 'visibility 0.4s',
          opacity: + allowOpenInEditor,
          ...(!allowOpenInEditor && { visibility: 'hidden' }),
        },
        accordionContainer: {
          '& .accordion-header-container': {
            '& span:last-child': {
              width: '100%',
            },
          },
        },
        ...commonClasses,
      })

const WidgetTitleBar = ({ allowOpenInEditor, onOpenInEditor }) => {
  const update = useStoreActions((actions) => actions.update)
  const save = useStoreActions((actions) => actions.save)
  const toast = useStoreActions((actions) => actions.toast)
  const resetWidget = useStoreActions((actions) => actions.resetWidget)
  const loadData = useStoreActions((actions) => actions.loadData)
  const undo = useStoreActions((actions) => actions.undo)
  const redo = useStoreActions((actions) => actions.redo)
  const undoAvailable = useStoreState((state) => state.undoAvailable)
  const redoAvailable = useStoreState((state) => state.redoAvailable)

  // widget state
  const dataSource = useStoreState((state) => state.dataSource)
  const id = useStoreState((state) => state.id)
  const tentativeConfig = useStoreState((state) => state.tentativeConfig)
  const config = useStoreState((state) => state.config)
  const dev = useStoreState((state) => state.dev)
  const unsavedChanges = useStoreState((state) => state.unsavedChanges)
  const title = useStoreState((state) => state.title)
  const isLoading = useStoreState((state) => state.isLoading)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const [isHover, setIsHover] = useState(false)
  const [showTitleBar, setShowTitleBar] = useState(false)

  const classes = useStyles({ mode, allowOpenInEditor, showTitleBar })

  const renderTitleAndID = (
    <div className={`render-title-container ${classes.main}`}>
      <EditableTitle />
      {
        mode === modes.EDITOR && unsavedChanges &&
        <div className={classes.item}>
          <Chip selectable={false} color='error' >
            unsaved
          </Chip>
        </div>
      }
      {
        id && mode !== modes.COMPACT &&
        <div className={classes.item}>
          <Chip
            selectable={false}
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
      }
    </div >
  )

  const renderDownloadConfigButton = (
    (dev || location?.hostname === 'localhost') && config &&
    <CustomButton
      classes={{
        button: classes.squareButton,
      }}
      onClick={() => saveConfig(config, id)}
    >
      <Icons.DownloadBold size='md' />
    </CustomButton>
  )

  const renderOpenInEditorButton = (
    <CustomButton
      classes={{ button: classes.editButton }}
      variant={mode === modes.COMPACT ? 'borderless' : 'filled'}
      size='sm'
      onClick={(e) => {
        onOpenInEditor
          ? onOpenInEditor(e, tentativeConfig)
          : update({ ui: { mode: modes.EDITOR } })
      }}
      {...(mode !== modes.COMPACT && { endIcon: <Icons.ShareExternalLink size='md' /> })}
    >
      {
        mode === modes.COMPACT
          ? <Icons.Gear size='md' />
          : 'OPEN IN EDITOR'
      }
    </CustomButton >
  )

  const showTitleBarArrow = () => {
    if (isHover) {
      return (
        <div className='showTitleBarArrow-container' onClick={() => setShowTitleBar(!showTitleBar)}>
          {showTitleBar ? <Icons.ChevronUp size='md' /> : <Icons.ChevronDown size='md' />}
        </div>
      )
    }
  }

  if (mode === modes.COMPACT) {
    return (
      <div
        className={`compact-overlay ${classes.compactOverlay}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className={`outer-container ${classes.outerContainer}`}>
          <div className='compact-container'>
            {isLoading ? '' :
              <div className={`title-container ${classes.titleContainer}`}>
                <span className='title-span'>{title}</span>
                <EditableSubtitle />
              </div>
            }
          </div>
          {allowOpenInEditor && renderOpenInEditorButton}
        </div>
        {showTitleBarArrow()}
      </div>
    )
  }

  return (
    mode === modes.EDITOR
      ? (
        <div className={classes.outerContainer}>
          <div className={classes.left}>
            <CustomButton
              horizontalMargin
              size='sm'
              variant='outlined'
              onClick={resetWidget}
            >
              reset
            </CustomButton>
            <CustomButton
              horizontalMargin
              size='sm'
              variant='outlined'
              onClick={undo}
              disabled={!undoAvailable}
              endIcon={<Icons.Undo size='md' />}
            >
              undo
            </CustomButton>
            <CustomButton
              horizontalMargin
              size='sm'
              variant='outlined'
              onClick={redo}
              disabled={!redoAvailable}
              startIcon={<Icons.Redo size='md' />}
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
              size='sm'
              onClick={() => loadData(dataSource)}
              startIcon={<Icons.Cycle size='md' />}
              disabled={!(dataSource?.id && dataSource?.type)}
            >
              reload data
            </CustomButton>
            <div className={classes.saveButton}>
              {/* <ButtonGroup variant='filled' size='sm'> */}
              <CustomButton
                disabled={!unsavedChanges}
                variant='filled'
                size='sm'
                onClick={save}
              >
                save
              </CustomButton>
              {/* <CustomButton
                  disabled
                  variant='filled'
                  size='sm'
                  onClick={() => loadData(dataSource)}
                >
                  <Icons.ArrowDown size='sm' />
                </CustomButton>
              </ButtonGroup> */}
            </div>
          </div>
        </div>
      )
      : (
        <Accordion color='secondary' className={`flex-initial flex p-4 border-b-2 border-neutral-100 shadow-blue-20 ${classes.accordionContainer}`}>
          <Accordion.Panel
            color='transparent'
            classes={{
              iconRoot: 'bg-opacity-0 children:text-primary-500',
              icon: 'fill-current text-primary-500',
              header: 'flex items-center accordion-header-container',
            }}
            header={
              <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                  {renderTitleAndID}
                  <EditableSubtitle />
                </div>
                <div className='h-5 flex'>
                  {/* <CustomButton
                    horizontalMargin
                    onClick={() => window.alert('not implemented')}
                  >
                    EXPORT
                  </CustomButton> */}
                  {renderOpenInEditorButton}
                  {renderDownloadConfigButton}
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

WidgetTitleBar.propTypes = {
  allowOpenInEditor: PropTypes.bool,
  onOpenInEditor: PropTypes.func,
}
WidgetTitleBar.defaultProps = {
  allowOpenInEditor: true,
  onOpenInEditor: null,
}

export default WidgetTitleBar
