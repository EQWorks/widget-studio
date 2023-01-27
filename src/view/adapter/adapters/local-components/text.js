import React from 'react'
import PropTypes from 'prop-types'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
    height: '100%',

    '& .title-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: '1.5rem',
      color: getTailwindConfigColor('secondary-700'),
    },
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    paddingBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getTailwindConfigColor('neutral-200'),
    overflowWrap: 'normal',
  },
  value: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-800'),
  },
})

const Text = ({ title, value, genericOptions }) => {

  const { showWidgetTitle } = genericOptions

  return (
    <div className={classes.outerContainer}>
      {showWidgetTitle && <div className="title-container">{title}</div>}
      <div className={classes.innerContainer}>
        <div className={classes.value}>
          {value}
        </div>
      </div>
    </div>
  )
}

Text.propTypes = {
  value: PropTypes.string.isRequired,
  title: PropTypes.string,
  genericOptions: PropTypes.object.isRequired,
}

Text.defaultProps = {
  title: '',
}

export default Text
