import React from 'react'

import { Button } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import { Controls, Save, Trash } from '../../components/icons'
import Icons from '../shared/widget-type-icons'
import WidgetControlCard from '../shared/widget-control-card'
import CustomAccordion from '../../components/custom-accordion'
import types from '../../constants/types'
import typeInfo from '../../constants/type-info'
import MapValueControls from '../shared/map-value-controls'
import ValueControls from '../shared/value-controls'
import modes from '../../constants/modes'
import GenericOptionControls from '../shared/generic-option-controls'
import CustomToggle from '../../components/custom-toggle'


const renderButton = (children, onClick, props) =>
  <Button
    classes={{ button: 'outline-none focus:outline-none uppercase px-1.5 py-1.5 tracking-widest' }}
    type='primary'
    variant='borderless'
    size='md'
    onClick={e => {
      e.stopPropagation()
      onClick(e)
    }}
    {...props}
  >
    <div className='flex'>
      {children}
    </div>
  </Button>

const QLModeControls = () => {
  // store actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)
  const resetWidget = useStoreActions(actions => actions.resetWidget)

  // state
  const isReady = useStoreState((state) => state.isReady)
  const type = useStoreState((state) => state.type)
  const dataReady = useStoreState((state) => state.dataReady)
  const uniqueOptions = useStoreState((state) => state.uniqueOptions)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const allowReset = useStoreState((state) => state.ui.allowReset)

  const footer = <>
    <div className='flex-1'>
      {renderButton(
        <>
          <Trash size='md' className={`mr-1.5 fill-current ${allowReset ? 'text-primary-500' : 'text-secondary-500'}`} />
          RESET
        </>,
        resetWidget,
        { disabled: !allowReset }
      )}
    </div>
    {renderButton(
      <>
        SAVE & UPDATE
        <Save size='md' className='ml-1.5 fill-current text-white' />
      </>,
      () => alert('not implemented'),
      { variant: 'filled' }
    )
    }
  </>

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
    <CustomAccordion
      disabled={!dataReady}
      icon={Controls}
      title={'Controls'}
      footer={footer}
      open={showWidgetControls}
      toggle={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
    >
      <div className='flex flex-col w-full'>
        <WidgetControlCard
          title='Select Widget Type'
          clearable
        >
          <Icons disabled={!dataReady} />
        </WidgetControlCard>
        {isReady && (
          <>
            {type === types.MAP ? <MapValueControls /> : <ValueControls />}
            {mode === modes.EDITOR && renderUniqueOptions}
            {mode === modes.EDITOR && <GenericOptionControls />}
          </>
        )}
      </div>
    </CustomAccordion>
  )
}

export default QLModeControls
