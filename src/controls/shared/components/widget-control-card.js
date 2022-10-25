import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import ControlCardButton from './control-card-button'
import { useStoreState, useStoreActions } from '../../../store'
import card_types from '../../../constants/card-types'
import modes from '../../../constants/modes'


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
    marginBottom: '1rem',
  },
}

const useStyles = (mode = modes.EDITOR) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        padding: '0.938rem 1.25rem',
        borderBottom: `1px solid ${getTailwindConfigColor('secondary-300')}`,
      },
      titleContainer: {
        display: 'flex',
        fontSize: '1rem',
        lineHeight: '1.429rem',
        fontWeight: 700,
        color: getTailwindConfigColor('secondary-900'),
        marginBottom: '0.857rem',
        height: '1.429rem',
      },
      content: {
        paddingTop: '0 !important',
        '&:first-child': {
          marginTop: '0 !important',
          paddingTop: '0 !important',
        },
      },
      ...commonClasses,
    }
    : {
      outerContainer: {
        borderRadius: '0.25rem',
        margin: '0.25rem 0',
        border: `1px solid ${getTailwindConfigColor('neutral-100')}`,
      },
      titleContainer: {
        display: 'flex',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: getTailwindConfigColor('secondary-700'),
        background: getTailwindConfigColor('neutral-100'),
        padding: '0.4rem 0.75rem',
      },
      content: {
        padding: '0.5rem 0.75rem',
      },
      ...commonClasses,
    }
)

const WidgetControlCard = ({
  title,
  titleExtra,
  description,
  clear,
  enableEdit,
  disableEditButton,
  children,
  type,
}) => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const widgetControlCardEdit = useStoreState((state) => state.widgetControlCardEdit)
  const mode = useStoreState((state) => state.ui.mode)
  const classes = useStyles(mode)

  const renderTitle = (
    <div className={classes.titleContainer}>
      <div className={classes.titleText}>
        {`${title}:`}
      </div>
      {titleExtra}
      {enableEdit && mode === modes.EDITOR &&
        (
          disableEditButton && !widgetControlCardEdit[type]
            ? <Tooltip
              arrow={false}
              description={'No editable feature.'}
            >
              <ControlCardButton
                disabled={disableEditButton}
              >
                {widgetControlCardEdit[type] ? 'Done' : 'Edit'}
              </ControlCardButton>
            </Tooltip>
            : <ControlCardButton
              onClick={() => userUpdate({ widgetControlCardEdit: { [type]: !widgetControlCardEdit[type] } })}
              disabled={disableEditButton}
            >
              {widgetControlCardEdit[type] ? 'Done' : 'Edit'}
            </ControlCardButton>
        )
      }
      {clear &&
        <ControlCardButton
          onClick={clear}
        >
          Clear
        </ControlCardButton>
      }
    </div >
  )

  return (
    children &&
    <div className={classes.outerContainer}>
      {title && renderTitle}
      {description && <div className={classes.description}> {description} </div>}
      <div className={classes.content}> {children} </div>
    </div>
  )
}

WidgetControlCard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  title: PropTypes.string,
  titleExtra: PropTypes.node,
  description: PropTypes.node,
  clear: PropTypes.func,
  enableEdit: PropTypes.bool,
  disableEditButton: PropTypes.bool,
  type: PropTypes.string,
}

WidgetControlCard.defaultProps = {
  children: [],
  title: '',
  titleExtra: null,
  description: null,
  clear: null,
  enableEdit: false,
  disableEditButton: false,
  type: card_types.GENERAL,
}

export default WidgetControlCard
