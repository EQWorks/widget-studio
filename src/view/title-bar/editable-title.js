import React, { useState, useEffect } from 'react'

import { TextField, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { EditPen } from '../../components/icons'
import { useStoreState, useStoreActions } from '../../store'
import CustomButton from '../../components/custom-button'
import modes from '../../constants/modes'


const commonClasses = {
  outerContainer: {
    height: '1.4rem',
    alignItems: 'center',
    margin: '0 0.6rem',
    display: 'flex',
  },
  button: {
    marginLeft: '0.4rem',
    background: 'transparent !important',
    '& svg': {
      fill: getTailwindConfigColor('secondary-600'),
      transition: 'fill 0.3s',
    },
    '&:hover': {
      '& svg': {
        fill: getTailwindConfigColor('secondary-800'),
      },
    },
  },
}

const useStyles = (mode) => makeStyles(
  mode === modes.EDITOR
    ? {
      title: {
        display: 'flex',
        alignItems: 'center',
        color: getTailwindConfigColor('secondary-600'),
        fontWeight: 700,
        background: getTailwindConfigColor('secondary-100'),
        fontSize: '0.875rem',
        padding: '0.2rem 0.4rem',
        paddingLeft: '0.6rem',
        cursor: 'default',
      },
      ...commonClasses,
    }
    : {
      title: {
        color: getTailwindConfigColor('primary-500'),
        fontWeight: 700,
      },
      ...commonClasses,
    }
)

const EditableTitle = () => {
  // store actions
  const update = useStoreActions((actions) => actions.update)

  // widget state
  const title = useStoreState((state) => state.title)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)

  const classes = useStyles(mode)

  const [editing, setEditing] = useState(false)

  const [tentativeTitle, setTentativeTitle] = useState(title)
  useEffect(() => {
    setTentativeTitle(title)
  }, [title])

  const renderEditButton = (
    <CustomButton
      className={classes.button}
      type='secondary'
      onClick={() => setEditing(true)}
    >
      <EditPen size="md" className='fill-current text-secondary-600' />
    </CustomButton >
  )

  const renderTitle = (
    mode === modes.EDITOR
      ? <div className={classes.title} >
        {title || 'Untitled Widget'}
        {renderEditButton}
      </div >
      : <>
        <span className='text-lg font-bold text-primary-500'>
          {title || 'Untitled Widget'}
        </span>
        {renderEditButton}
      </>
  )

  return (
    <div className={classes.outerContainer}>
      {
        editing
          ? <form
            action='.'
            onSubmit={(e) => {
              update({ title: e.target.children[0].children[0].value })
              setEditing(false)
            }}
          >
            <TextField
              autoFocus
              size='lg'
              value={tentativeTitle}
              onChange={(v) => setTentativeTitle(v)}
              onBlur={() => {
                setTentativeTitle(title)
                setEditing(false)
              }}
            />
          </form>
          : <>
            {renderTitle}
          </>
      }
    </div>
  )
}

export default EditableTitle
