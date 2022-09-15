import React, { useState, useMemo, useEffect } from 'react'

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
  },
  subtitle: {
    marginTop: '-0.4rem',
    width: '100%',
  },
  subtitleContainer: {
    maxHeight: '2.5rem',
    margin: mode === modes.COMPACT ? 0 : '0 0.6rem',
    display: 'flex',
    gap: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: '1.25rem',
    letterSpacing: '0.016rem',
    color: getTailwindConfigColor('secondary-600'),
    whiteSpace: 'normal',
  },
  hyperlink: {
    color: getTailwindConfigColor('interactive-500'),
    textDecoration: 'underline',
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

  const [tentativeSubtitle, setTentativeSubtitle] = useState(subtitle)
  const [tentativeLinkLabel, setTentativeLinkLabel] = useState(subtitleLinkLabel)
  const [tentativeHyperlink, setTentativeHyperlink] = useState(subtitleHyperlink)

  useEffect(() => setTentativeSubtitle(subtitle), [subtitle])
  useEffect(() => setTentativeLinkLabel(subtitleLinkLabel), [subtitleLinkLabel])
  useEffect(() => setTentativeHyperlink(subtitleHyperlink), [subtitleHyperlink])

  const validHyperlink = useMemo(() => Boolean(tentativeHyperlink
    // source: https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff650303(v=pandp.10)?redirectedfrom=MSDN#:~:text=e%2Dmail%20address.-,URL,-%5E(ht%7Cf)tp
    ?.match(/^http(s?):\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-.?,'/\\+&amp;%$#_]*)?$/g)
    ?.length)
  ,[tentativeHyperlink])

  const classes = useStyles(mode)

  return (
    <div className={classes.outerContainer}>
      {mode === modes.EDITOR ?
        <div className='editor-mode-container'>
          {renderItem('Subtitle',
            <div className={classes.subtitle}>
              <TextField.Area
                classes={textfieldClasses}
                value={tentativeSubtitle}
                inputProps={{ placeholder: 'Add subtitle' }}
                onChange={(val) => setTentativeSubtitle(val)}
                onBlur={(e) => {
                  setTentativeSubtitle(e.target.value)
                  userUpdate({ subtitle: (e.target.value) })
                }}
                maxLength={150}
              />
            </div>
          )}
          {renderItem('Link Label',
            <TextField
              classes={textfieldClasses}
              value={tentativeLinkLabel}
              inputProps={{ placeholder: 'Add subtitle link label' }}
              onChange={(val) => setTentativeLinkLabel(val)}
              onBlur={(e) => {
                setTentativeLinkLabel(e.target.value)
                userUpdate({ subtitleLinkLabel: (e.target.value) })
              }}
              maxLength={30}
            />
          )}
          {renderItem('Hyperlink',
            <TextField
              error={tentativeLinkLabel && !validHyperlink}
              disabled={!tentativeLinkLabel}
              helperText={tentativeLinkLabel && !validHyperlink ? 'Invalid hyperlink' : ''}
              classes={textfieldClasses}
              inputProps={{ placeholder: 'Add subtitle link (ex: http://..)' }}
              value={tentativeHyperlink}
              onChange={(val) => setTentativeHyperlink(val)}
              onBlur={(e) => {
                setTentativeHyperlink(e.target.value)
                userUpdate({ subtitleHyperlink: e.target.value })
              }}
            />
          )}
        </div>
        : (subtitle || (subtitleLinkLabel && subtitleHyperlink)) && (
          <div className={classes.subtitleContainer}>
            {isLoading ? '...' : subtitle}
            {!isLoading && subtitleLinkLabel && subtitleHyperlink &&
              <a className={classes.hyperlink} href={subtitleHyperlink}>
                {subtitleLinkLabel}
              </a>
            }
          </div>
        )}
    </div>
  )
}

export default EditableSubtitle
