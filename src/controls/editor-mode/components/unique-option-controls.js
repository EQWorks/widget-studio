import PropTypes from 'prop-types'

import { useStoreActions, useStoreState } from '../../../store'
import typeInfo from '../../../constants/type-info'
import types from '../../../constants/types'
import { renderCheckbox } from '../../shared/util'


const UniqueOptionControls = ({ type }) => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  return (
    Object.entries(typeInfo[type]?.uniqueOptions || {})
      .map(([k, { name, type }], i) => {
        switch (type) {
          case Boolean: // TODO support types other than bool
            return renderCheckbox(
              name,
              uniqueOptions[k],
              v => userUpdate({ uniqueOptions: { [k]: v } }),
              false,
              i
            )
        }
      })
  )
}

UniqueOptionControls.propTypes = {
  type: PropTypes.oneOf(['', ...Object.values(types)]),
}
UniqueOptionControls.defaultProps = {
  type: null,
}

export default UniqueOptionControls
