import React, { useState } from 'react'

import { TextField, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import modes from '../../constants/modes'


const useStyles = (mode) => makeStyles({
  outerContainer: {
    fontSize: '0.875rem',
    letterSpacing: '0.016rem',

    '& .textfield-container': {
      display: 'inline',

      '& form': {
        '& div': {
          height: '4rem',
        },
      },
    },

    '& .subtitle-container': {
      margin: mode === modes.COMPACT ? 0 : '0 0.6rem',
      color: getTailwindConfigColor('secondary-600'),
    },
  },
})

const textfieldClasses = Object.freeze({
  container: 'textfield-container',
})

const EditableSubtitle = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const isLoading = useStoreState((state) => state.isLoading)
  const subtitle = useStoreState((state) => state.subtitle)
  const mode = useStoreState((state) => state.ui.mode)
  const showWidgetSubtitle = useStoreState((state) => state.genericOptions.showWidgetSubtitle)

  const [tentativeSubtitle, setTentativeSubtitle] = useState(subtitle)

  const classes = useStyles(mode)

  return (
    <div className={classes.outerContainer}>
      {mode === modes.EDITOR ?
        <div className="editor-mode-container">
          <TextField.Area
            classes={textfieldClasses}
            value={tentativeSubtitle}
            onChange={(val) => setTentativeSubtitle(val)}
            onBlur={(e) => {
              setTentativeSubtitle(e.target.value)
              userUpdate({ subtitle: e.target.value })
            }}
            maxLength={100}
          />
        </div>
        :
        showWidgetSubtitle && (
          <div className='subtitle-container'>
            {isLoading ? '...' : subtitle}
          </div>
        )
      }
    </div>
  )
}

export default EditableSubtitle
