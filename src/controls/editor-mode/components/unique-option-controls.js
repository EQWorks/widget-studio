import PropTypes from 'prop-types'

import { useStoreActions, useStoreState } from '../../../store'
import typeInfo from '../../../constants/type-info'
import types from '../../../constants/types'
import { renderToggle, renderRow } from '../../shared/util'


const UniqueOptionControls = ({ type }) => {
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const nestedUpdate = useStoreActions((actions) => actions.nestedUpdate)

  return (
    renderRow(
      null,
      Object.entries(typeInfo[type]?.uniqueOptions || {})
        .map(([k, { name, type }]) => {
          switch (type) {
            case Boolean: // TODO support types other than bool
              return renderToggle(
                name,
                uniqueOptions[k],
                v => nestedUpdate({ uniqueOptions: { [k]: v } })
              )
          }
        })
    )
  )
}

UniqueOptionControls.propTypes = {
  type: PropTypes.oneOf(types),
}
UniqueOptionControls.defaultProps = {
  type: null,
}

export default UniqueOptionControls
