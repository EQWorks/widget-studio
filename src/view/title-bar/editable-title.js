import React, { useState, useEffect } from 'react'

import { Icons, TextField, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

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

const useStyles = () => makeStyles(
  {
    title: {
      color: getTailwindConfigColor('primary-500'),
      fontSize: '1.125rem',
      fontWeight: 700,
    },
    ...commonClasses,
  },
)

const textFieldClasses = Object.freeze({
  container: 'bg-secondary-100',
  input: 'mb-0 text-sm text-secondary-600'
})

const EditableTitle = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const isLoading = useStoreState((state) => state.isLoading)
  const title = useStoreState((state) => state.title)
  const mode = useStoreState((state) => state.ui.mode)

  const classes = useStyles()

  const [editing, setEditing] = useState(false)
  const [tentativeTitle, setTentativeTitle] = useState(title)

  useEffect(() => {
    setTentativeTitle(title)
  }, [title])


  const renderTitle = (
    <div className={`edit-title-class ${classes.title}`} >
      {isLoading ? '...' : title}
    </div >
  )

  const updateTitle = title => userUpdate({ title })

  return (
    <div className={classes.outerContainer}>
      {
        mode === modes.EDITOR
          ? <form
            action='.'
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.nativeEvent.preventDefault()
              e.nativeEvent.stopPropagation()
              updateTitle(e.target.children[0].children[0].value)
              setEditing(false)
            }}
          >
            {/* <TextField
              autoFocus
              size='lg'
              value={tentativeTitle}
              onChange={(v) => setTentativeTitle(v)}
              onSubmit={(e) => {
                e.nativeEvent.preventDefault()
                e.nativeEvent.stopPropagation()
              }}
              onBlur={(e) => {
                updateTitle(e.target.value)
                setTentativeTitle(title)
                setEditing(false)
              }}
            /> */}
            <TextField
              variant='borderless'
              autoFocus
              classes={textFieldClasses}
              value={tentativeTitle}
              onChange={(v) => setTentativeTitle(v)}
              onFocus={(e) => {
                e.nativeEvent.preventDefault()
                e.nativeEvent.stopPropagation()
                setEditing(true)
              }}
              onBlur={(e) => {
                e.nativeEvent.preventDefault()
                e.nativeEvent.stopPropagation()
                updateTitle(e.target.value)
                setTentativeTitle(title)
                setEditing(false)
              }}
              deleteButton={editing}
            />
          </form>
          : 
          <>
            {renderTitle}
          </>
      }
    </div>
  )
}

export default EditableTitle
