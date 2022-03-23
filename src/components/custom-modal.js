import React from 'react'
import PropTypes from 'prop-types'

import { Modal, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  modal: {
    width: '100% !important',
    height: '100% !important',
  },
})

const CustomModal = ({ children, title, onClose }) => {
  return (
    <Modal
      open
      classes={{
        container: classes.modal,
        main: classes.modal,
        content: classes.modal,
      }}
      closeModal={onClose}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  )
}

CustomModal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  onClose: PropTypes.func,
}
CustomModal.defaultProps = {
  children: <></>,
  title: '',
  onClose: () => { },
}

export default CustomModal
