import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../../store'
import typeInfo from '../../../constants/type-info'
import types from '../../../constants/types'
import { renderCheckbox, renderToggle, renderMultiSelect, renderRadioSelect } from '../../shared/util'
import { tableUniqueOptions, borderType, headerColor } from '../../../constants/table-widget'


const useStyles = ({ gridCols }) => makeStyles({
  uniqueOptionsBooleanContainer : {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
    alignItems: 'center',
    columnGap: '0.75rem',

    '& .table-bar__select-options': {
      gridColumn: 'span 2',

      '& .radio-select__root-container': {
        marginBottom: '0.313rem',
      },
    },
  },
})

const UniqueOptionControls = ({ type }) => {
  const userUpdate = useStoreActions((actions) => actions.userUpdate)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)

  const gridCols = useMemo(() => {
    const options = Object.keys(typeInfo[type]?.uniqueOptions || {}).length

    if ([2, 4].includes(options) || types.TABLE === type) {
      return 2
    }
    return 3
  }, [type])

  const tableData = useMemo(() => {
    return renderableValueKeys.map(({ title }) => title)
  }, [renderableValueKeys])

  const getTableRadioSelectionData = (type) => {
    if (tableUniqueOptions[type] === 'borderType') return borderType
    if (tableUniqueOptions[type] === 'headerColor') return headerColor
  }

  const classes = useStyles({ gridCols })

  return (
    <>
      <div className={classes.uniqueOptionsBooleanContainer}>
        {Object.entries(typeInfo[type]?.uniqueOptions || {})
          .map(([k, { name, type: _type }], i) => {
            switch (_type) {
              case Boolean: // TODO support types other than bool
                return (
                  <div key={i} className='unique-options__item-container'>
                    {types.TABLE !== type &&
                      renderCheckbox(
                        name,
                        uniqueOptions[k],
                        v => userUpdate({ uniqueOptions: { [k]: v } }),
                        false,
                        i
                      )
                    }
                    {types.TABLE === type &&
                      renderToggle(
                        name,
                        uniqueOptions[k],
                        v => userUpdate({ uniqueOptions: { [k]: v } }),
                      )
                    }
                  </div>
                )
              case String:
                return (
                  <div className='table-bar__select-options'>
                    {types.TABLE === type &&
                      renderRadioSelect(
                        name,
                        getTableRadioSelectionData(k),
                        uniqueOptions[k],
                        e => userUpdate({ uniqueOptions: { [k]: e.target.value } })
                      )
                    }
                  </div>
                )
              case Array:
                return (
                  <div className='table-bar__select-options'>
                    {types.TABLE === type &&
                      renderMultiSelect(
                        name,
                        tableData,
                        uniqueOptions[k],
                        v => userUpdate({ uniqueOptions: { [k]: v } })
                      )
                    }
                  </div>
                )
              default:
                return null
            }
          })
        }
      </div>
    </>
  )
}

UniqueOptionControls.propTypes = {
  type: PropTypes.oneOf(['', ...Object.values(types)]),
}
UniqueOptionControls.defaultProps = {
  type: null,
}

export default UniqueOptionControls
