import React from 'react'
import PropTypes from 'prop-types'

import { getTailwindConfigColor, makeStyles, Tooltip } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../store'
import types from '../../constants/types'
import typeInfo from '../../constants/type-info'
import modes from '../../constants/modes'
import WidgetControlCard from './components/widget-control-card'
import MutedBarrier from './muted-barrier'


const commonClasses = {
  titleText: {
    flex: 1,
  },
  description: {
    color: getTailwindConfigColor('secondary-600'),
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem',
    paddingBottom: '0.25rem',
    paddingTop: '0.5rem',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontStyle: 'italic',
    letterSpacing: '0.025em',
  },
  button: {
    outline: 'none !important',
    '&:hover': {
      outline: 'none !important',
    },
    '&:active': {
      outline: 'none !important',
    },
  },
  disabledButton: {
    cursor: 'default !important',
  },
  disabledIcon: {
    '&> p': {
      color: `${getTailwindConfigColor('secondary-400')} !important`,
    },
    '&> svg': {
      background: `${getTailwindConfigColor('secondary-100')} !important`,
      color: `${getTailwindConfigColor('secondary-400')} !important`,
    },
    '&:hover': {
      '&> svg': {
        background: `${getTailwindConfigColor('secondary-100')} !important`,
        color: `${getTailwindConfigColor('secondary-400')} !important`,
      },
      '&> p': {
        color: `${getTailwindConfigColor('secondary-400')} !important`,
      },
    },
  },
  selectedIcon: {
    '&> p': {
      color: `${getTailwindConfigColor('primary-600')} !important`,
    },
    '&> svg': {
      background: `${getTailwindConfigColor('primary-200')} !important`,
      color: `${getTailwindConfigColor('primary-700')} !important`,
    },
    '&:hover': {
      '&> svg': {
        background: `${getTailwindConfigColor('primary-200')} !important`,
        color: `${getTailwindConfigColor('primary-700')} !important`,
      },
    },
  },
}

const baseIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.813rem',
  '&> p': {
    transition: 'color 0.3s, background 0.3s',
    color: getTailwindConfigColor('secondary-600'),
  },
  '&> svg': {
    transition: 'color 0.3s, background 0.3s',
    width: '100%',
    borderRadius: '0.286rem',
    padding: '0.387rem',
    color: getTailwindConfigColor('primary-500'),
    background: getTailwindConfigColor('primary-50'),
  },
  '&:hover': {
    '&> svg': {
      background: getTailwindConfigColor('primary-100'),
      color: getTailwindConfigColor('primary-600'),
    },
    '&> p': {
      color: getTailwindConfigColor('secondary-700'),
    },
  },
  '&:active': {
    '&> svg': {
      color: getTailwindConfigColor('primary-700'),
    },
  },
}

const useStyles = ({ mode = modes.EDITOR }) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        columnGap: '2.688rem',
        rowGap: '1.25rem',
      },
      icon: {
        ...baseIconStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      label: {
        textTransform: 'capitalize',
        fontWeight: 700,
        fontSize: '0.714rem',
        marginTop: '0.4rem',
      },
      ...commonClasses,
    }
    : {
      outerContainer: {
        display: 'flex',
      },
      icon: {
        ...baseIconStyle,
        '--tw-shadow': '0px 1px 4px rgba(54, 111, 228, 0.1)',
        boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
        border: `0.3rem solid ${getTailwindConfigColor('secondary-50')}`,
        width: '2.214rem',
        borderRadius: '0.5rem',
        marginRight: '0.8rem',
        '&> svg': {
          ...baseIconStyle['&> svg'],
          padding: '0.3rem',
        },
      },
      label: {
        display: 'none',

      },
      ...commonClasses,
    }
)


const WidgetTypeControls = () => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const selectedType = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const domain = useStoreState((state) => state.domain)
  const validMapGroupKeys = useStoreState((state) => state.validMapGroupKeys)
  const mode = useStoreState((state) => state.ui.mode)
  const dataReady = useStoreState((state) => state.dataReady)
  const dataIsXWIReport = useStoreState((state) => state.dataIsXWIReport)

  const classes = useStyles({ mode })

  return (
    <MutedBarrier mute={!dataReady} >
      <WidgetControlCard title='Widget Type'>
        <div className={classes.outerContainer}>
          {
            Object.entries(typeInfo).map(([type, { mustGroup, icon: Icon, uniqueOptions }], i) => {
              const disabled = type === types.MAP && !(validMapGroupKeys?.length || dataIsXWIReport)
              let styles = [classes.icon]
              disabled && styles.unshift(classes.disabledIcon)
              type === selectedType && styles.unshift(classes.selectedIcon)
              const renderIcon = (
                <div className={styles.join(' ')}>
                  <Icon />
                  <p className={classes.label}>
                    {type}
                  </p>
                </div>
              )
              return (
                <button
                  key={i}
                  variant='borderless'
                  className={`${classes.button} ${disabled ? classes.disabledButton : ''}`}
                  onClick={() => {
                    if (!disabled && type !== selectedType) {
                      userUpdate({
                        group: mustGroup,
                        ...(
                          mustGroup !== group && {
                            groupFilter: [],
                            valueKeys: [],
                            ...(domain?.key && { [domain.key]: null }),
                          }
                        ),
                        type,
                        uniqueOptions:
                        Object.entries(uniqueOptions).reduce((acc, [k, { defaultValue }]) => {
                          acc[k] = defaultValue
                          return acc
                        }, {}),
                      })
                    }
                  }}
                >
                  {
                    disabled
                      ? <Tooltip
                        position='left'
                        description='No geo columns found in this dataset'
                        {...(mode === modes.EDITOR && { width: '10rem' })}
                      >
                        {renderIcon}
                      </Tooltip>
                      : renderIcon
                  }
                </button>
              )
            }
            )
          }
        </div >
      </WidgetControlCard>
    </MutedBarrier>
  )
}

WidgetTypeControls.propTypes = {
  disabled: PropTypes.bool,
}
WidgetTypeControls.defaultProps = {
  disabled: false,
}

export default WidgetTypeControls
