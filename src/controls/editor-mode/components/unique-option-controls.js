import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../../store'
import typeInfo from '../../../constants/type-info'
import types from '../../../constants/types'
import { renderCheckbox } from '../../shared/util'


const useStyles = ({ gridCols }) => makeStyles({
  uniqueOptionsContainer : {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
    alignItems: 'center',
    columnGap: '0.75rem',
  },
})

const UniqueOptionControls = ({ type }) => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)

  const gridCols = useMemo(() => {
    const options = Object.keys(typeInfo[type]?.uniqueOptions || {}).length

    if ([2, 4].includes(options)) {
      return 2
    }
    return 3
  }, [type])

  const classes = useStyles({ gridCols })

  return (
    <div className={classes.uniqueOptionsContainer}>
      {Object.entries(typeInfo[type]?.uniqueOptions || {})
        .map(([k, { name, type: _type }], i) => {
          switch (_type) {
            case Boolean: // TODO support types other than bool
              return (
                <div key={i}>
                  {renderCheckbox(
                    name,
                    uniqueOptions[k],
                    v => userUpdate({ uniqueOptions: { [k]: v } }),
                    false,
                    i
                  )}
                </div>
              )
          }
        })
      }
    </div>
  )
}

UniqueOptionControls.propTypes = {
  type: PropTypes.oneOf(['', ...Object.values(types)]),
}
UniqueOptionControls.defaultProps = {
  type: null,
}

export default UniqueOptionControls
