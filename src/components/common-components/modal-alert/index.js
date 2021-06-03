import React from 'react'
import PropTypes from 'prop-types'

import Modal from './modal'
import Card from './card'


const ModalAlert = ({ modalProps, cardProps }) => {
  return (
    <Modal { ...modalProps }>
      <Card { ...cardProps } />
    </Modal>
  )
}

ModalAlert.propTypes = {
  modalProps: PropTypes.object.isRequired,
  cardProps: PropTypes.object.isRequired,
}
export default ModalAlert
