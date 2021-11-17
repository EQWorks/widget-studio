import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@eqworks/lumen-labs'


const CustomButton = ({ className, ...props }) => <Button className={`${className} outline-none focus:outline-none`} {...props} />

CustomButton.propTypes = {
  className: PropTypes.string,
}
CustomButton.defaultProps = {
  className: '',
}

export default CustomButton
