import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'

import CustomButton from '../../components/custom-button'
import { Trash } from '../../components/icons'
import { useStoreState } from '../../store'
import modes from '../../constants/modes'


const commonClasses = {
  titleText: {
    flex: 1,
  },
  clearButtonInternalContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}

const useStyles = (mode = modes.EDITOR) => makeStyles(
  mode === modes.EDITOR
    ? {
      outerContainer: {
        padding: '0.8rem',
        borderBottom: `1px solid ${getTailwindConfigColor('neutral-100')}`,
      },
      titleContainer: {
        display: 'flex',
        fontSize: '0.875rem',
        fontWeight: 700,
        color: getTailwindConfigColor('secondary-900'),
        marginBottom: '0.7rem',
        padding: '0 0.5rem',
      },
      clearButton: {
        textTransform: 'capitalize',
        fontWeight: 600,
        fontSize: '0.75rem',
        color: getTailwindConfigColor('secondary-400'),
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
      clearButton: {
        display: 'flex',
        padding: '0.125rem 0.375rem',
        transitionProperty: 'all 0.3s ease',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        alignItems: 'center',
        fontSize: '0.65rem',
        borderRadius: '0.125rem',
        transition: 'all 0.3s ease',
        color: getTailwindConfigColor('secondary-600'),
        '& svg': {
          transition: 'all 0.3s ease',
          fill: getTailwindConfigColor('secondary-600'),
          marginLeft: '0.2rem',
        },
        '&:hover': {
          color: getTailwindConfigColor('secondary-800'),
          '& svg': {
            fill: getTailwindConfigColor('secondary-800'),
          },
        },
        background: getTailwindConfigColor('secondary-50'),
      },
      content: {
        padding: '0.5rem 0.75rem',
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
      ...commonClasses,
    }
)

const WidgetControlCard = ({ title, titleExtra, description, clearable, children }) => {
  const mode = useStoreState((state) => state.ui.mode)
  const classes = useStyles(mode)

  const renderTitle = (
    <div className={classes.titleContainer}>
      <div className={classes.titleText}>
        {`${title}:`}
      </div>
      {titleExtra}
      {clearable &&
        <CustomButton
          className={clsx(classes.clearButton, { 'shadow-light-10 hover:shadow-light-20': mode === modes.QL })}
          onClick={() => alert('not implemented')}
        >
          <div className={classes.clearButtonInternalContainer}>
            clear {mode === modes.QL && <Trash size='md' />}
          </div>
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
  clearable: PropTypes.bool,
}

WidgetControlCard.defaultProps = {
  children: [],
  title: '',
  titleExtra: null,
  description: null,
  clearable: false,
}

export default WidgetControlCard
