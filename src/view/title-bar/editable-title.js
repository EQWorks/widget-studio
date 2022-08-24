import React, { useState, useEffect, useRef } from 'react'

import { TextField, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import modes from '../../constants/modes'
import { getTextSize } from '../../util/string-manipulation'


const commonClasses = {
  outerContainer: {
    height: '1.4rem',
    alignItems: 'center',
    margin: '0 0.6rem',
    display: 'flex',

    '& .textfield-container': {
      backgroundColor: getTailwindConfigColor('secondary-100'),

      '& .textfield-root': {
        borderTop: 0,

        '& .textfield-input': {
          fontFamily: 'Open Sans',
          outlineWidth: 0,
          outlineColor: 'transparent',
        },
      },

      '& .textfield-root:focus-within': {
        borderColor: getTailwindConfigColor('primary-500'),
      },
    },
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
  container: 'textfield-container',
  root: 'textfield-root',
  input: 'textfield-input mb-0 text-sm focus:text-secondary-900',
})

const EditableTitle = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const isLoading = useStoreState((state) => state.isLoading)
  const title = useStoreState((state) => state.title)
  const mode = useStoreState((state) => state.ui.mode)

  const classes = useStyles()

  const [editing, setEditing] = useState(false)
  const [tentativeTitle, setTentativeTitle] = useState(title)

  const textfieldRef = useRef(null)

  useEffect(() => {
    setTentativeTitle(title)
  }, [title])

  const renderTitle = (
    <div className={`edit-title-class ${classes.title}`} >
      {isLoading ? '...' : title}
    </div >
  )

  const renderTextfield = () => {
    if (textfieldRef.current) {
      let el = textfieldRef.current.childNodes[0][0]
      const lengthSize = el.value.length > 12 ? 14 : 16
      el.style.width = `${getTextSize(el.value, 700, lengthSize, 'Open Sans').width}px`
    }

    return (
      <TextField
        variant='borderless'
        classes={textFieldClasses}
        value={tentativeTitle}
        onChange={(v) => {
          setTentativeTitle(v)
        }}
        onBlur={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.nativeEvent.preventDefault()
          e.nativeEvent.stopPropagation()
          setEditing(false)
        }}
        onFocus={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.nativeEvent.preventDefault()
          e.nativeEvent.stopPropagation()
          setEditing(true)
        }}
        deleteButton={editing}
        onDelete={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.nativeEvent.preventDefault()
          e.nativeEvent.stopPropagation()
          updateTitle('')
        }}
      />
    )
  }

  const updateTitle = title => userUpdate({ title })

  return (
    <div
      ref={textfieldRef}
      className={classes.outerContainer}
    >
      {
        mode === modes.EDITOR
          ?
          <>
            {renderTextfield()}
          </>
          :
          <>
            {renderTitle}
          </>
      }
    </div>
  )
}

export default EditableTitle
