import React from 'react'
import PropTypes from 'prop-types'

import { Icons, getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import CustomButton from '../../../components/custom-button'
import { useStoreState } from '../../../store'
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
  },
}

const useStyles = (mode = modes.EDITOR) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        padding: '0.8rem',
        borderBottom: `1px solid ${getTailwindConfigColor('secondary-300')}`,
      },
      titleContainer: {
        display: 'flex',
        fontSize: '0.875rem',
        fontWeight: 700,
        color: getTailwindConfigColor('secondary-900'),
        marginBottom: '0.2rem',
        padding: '0 0.5rem',
      },
      content: {
        padding: '0 0.5rem',
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
        paddingTop: 0,
      },
      ...commonClasses,
    }
)

const WidgetControlCard = ({ title, titleExtra, description, clear, children }) => {
  const mode = useStoreState((state) => state.ui.mode)
  const classes = useStyles(mode)

  const renderTitle = (
    <div className={classes.titleContainer}>
      <div className={classes.titleText}>
        {`${title}:`}
      </div>
      {titleExtra}
      {clear &&
        <CustomButton
          type='secondary'
          size={mode === modes.QL ? 'sm' : 'md'}
          onClick={clear}
          {...(mode === modes.QL && {
            endIcon: <Icons.Trash size='sm' />,
          })}
        >
          Clear
        </CustomButton>}
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
}

WidgetControlCard.defaultProps = {
  children: [],
  title: '',
  titleExtra: null,
  description: null,
  clear: null,
}

export default WidgetControlCard
