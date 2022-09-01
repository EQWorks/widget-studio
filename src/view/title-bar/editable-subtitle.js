import React, { useState } from 'react'

import { TextField, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import modes from '../../constants/modes'
import { renderItem } from '../../controls/shared/util'


const useStyles = (mode) => makeStyles({
  outerContainer: {
    '& .textfield-container': {
      width: '100%',
      display: 'inline',
      '& form': {
        '& div': {
          height: '4rem',
          '& textarea': {
            letterSpacing: '.1em',
          },
        },
      },
      '& div': {
        '& input': {
          letterSpacing: '.1em',
        },
      },
    },
    '& .subtitle-container': {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.016rem',
      margin: mode === modes.COMPACT ? 0 : '0 0.6rem',
      color: getTailwindConfigColor('secondary-600'),
    },
  },
  hyperlink: {
    marginTop: '-6px',
    width: '100%',
  },
})

const textfieldClasses = Object.freeze({
  container: 'textfield-container',
})

const EditableSubtitle = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)

  const isLoading = useStoreState((state) => state.isLoading)
  const subtitle = useStoreState((state) => state.subtitle)
  const subtitleLinkLabel = useStoreState((state) => state.subtitleLinkLabel)
  const subtitleHyperlink = useStoreState((state) => state.subtitleHyperlink)
  const mode = useStoreState((state) => state.ui.mode)
  const showWidgetSubtitle = useStoreState((state) => state.genericOptions.showWidgetSubtitle)

  const [tentativeSubtitle, setTentativeSubtitle] = useState(subtitle)
  const [tentativeLinkLabel, setTentativeLinkLabel] = useState(subtitleLinkLabel)
  const [tentativeHyperlink, setTentativeHyperlink] = useState(subtitleHyperlink)

  const classes = useStyles(mode)

  return (
    <div className={classes.outerContainer}>
      {mode === modes.EDITOR ?
        <div className='editor-mode-container'>
          <TextField.Area
            classes={textfieldClasses}
            value={tentativeSubtitle}
            onChange={(val) => setTentativeSubtitle(val)}
            onBlur={(e) => {
              setTentativeSubtitle(e.target.value)
              userUpdate({ subtitle: (e.target.value) })
            }}
            onSubmit={(e) => {
              e.nativeEvent.preventDefault()
              e.nativeEvent.stopPropagation()
            }}
            maxLength={100}
          />
          {renderItem('Link Label',
            <TextField
              classes={textfieldClasses}
              value={tentativeLinkLabel}
              placeholder='Add subtitle link label'
              onChange={(val) => setTentativeLinkLabel(val)}
              onBlur={(e) => {
                setTentativeLinkLabel(e.target.value)
                userUpdate({ subtitleLinkLabel: (e.target.value) })
              }}
              onSubmit={(e) => {
                e.nativeEvent.preventDefault()
                e.nativeEvent.stopPropagation()
              }}
              maxLength={30}
            />
          )}
          {renderItem('Hyperlink',
            <div className={classes.hyperlink}>
              <TextField.Area
                classes={textfieldClasses}
                placeholder='Add subtitle link'
                value={tentativeHyperlink}
                onChange={(val) => setTentativeHyperlink(val)}
                onBlur={(e) => {
                  setTentativeHyperlink(e.target.value)
                  userUpdate({ subtitleHyperlink: e.target.value })
                }}
                onSubmit={(e) => {
                  e.nativeEvent.preventDefault()
                  e.nativeEvent.stopPropagation()
                }}
              />
            </div>
          )}
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
