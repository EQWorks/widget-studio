import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreActions, useStoreState } from '../../store'
import Icons from '../shared/widget-type-icons'
import WidgetControlCard from '../shared/widget-control-card'
import CustomToggle from '../../components/custom-toggle'
import GenericOptionControls from './generic-option-controls'
import typeInfo from '../../constants/type-info'


const classes = makeStyles({
  outerContainer: {
    width: '20rem',
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${getTailwindConfigColor('neutral-100')}`,
  },
})

const EditorModeControls = () => {
  const type = useStoreState((state) => state.type)
  const dataReady = useStoreState((state) => state.dataReady)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)
  const nestedUpdate = useStoreActions((actions) => actions.nestedUpdate)

  const renderBool = (title, value) => {
    const [k, v] = Object.entries(value)[0]
    return (
      <CustomToggle
        value={v}
        label={title}
        onChange={_v => nestedUpdate({ uniqueOptions: { [k]: _v } })}
      />
    )
  }

  const renderUniqueOptions = (
    <WidgetControlCard
      clearable
      title='Styling'
    >
      {
        Object.entries(typeInfo[type]?.uniqueOptions || {})
          .map(([k, { name, type }]) => {
            if (type === Boolean) { // TODO support other types of uniqueOptions
              return renderBool(name, { [k]: uniqueOptions[k] })
            }
          })
      }
    </WidgetControlCard>
  )

  return (
    <div className={classes.outerContainer}>
      <WidgetControlCard
        title='Select Widget Type'
        clearable
      >
        <Icons disabled={!dataReady} />
      </WidgetControlCard>
      {/* {
        createElement(controls[type || 'line'])
      } */}
      {renderUniqueOptions}
      <GenericOptionControls />
    </div>
  )
}

EditorModeControls.propTypes = {
  className: PropTypes.string,
}
EditorModeControls.defaultProps = {
  className: '',
}

export default EditorModeControls
