import React from 'react'
import PropTypes from 'prop-types'

import { Icons, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState } from '../../../store'
import CustomButton from '../../../components/custom-button'
import modes from '../../../constants/modes'


const classes = makeStyles({
  button: {
    height: '100%',
    display: 'flex',
    alignItems: 'center !important',
    padding: '0 0.4rem !important',
    '&>div': {
      margin: '0 !important',
    },
  },
})

const ControlCardButton = ({ onClick, disabled, children }) => {
  const mode = useStoreState((state) => state.ui.mode)

  return (
    <CustomButton
      type='secondary'
      size={mode === modes.QL ? 'sm' : 'md'}
      onClick={onClick}
      {...(mode === modes.QL && children === 'Clear' && {
        endIcon: <Icons.Trash size='sm' />,
      })}
      {...(classes.button && {
        classes: {
          button: classes.button,
        },
      })}
      {...{ onClick, disabled }}
    >
      {children}
    </CustomButton>
  )
}

ControlCardButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.string,
}

ControlCardButton.defaultProps = {
  onClick: () => {},
  disabled: false,
  children: '',
}

export default ControlCardButton
