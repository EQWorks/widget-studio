import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import { Controls, Save, Trash } from '../../components/icons'
import Icons from '../shared/widget-type-icons'
import WidgetControlCard from '../shared/widget-control-card'
import CustomAccordion from '../../components/custom-accordion'
import types from '../../constants/types'
import MapValueControls from '../shared/map-value-controls'
import ValueControls from '../shared/value-controls'
import CustomButton from '../../components/custom-button'


const renderButton = (children, onClick, props) => (
  <CustomButton
    customVariant={1}
    onClick={onClick}
    {...props}
  >
    <div className='flex'>
      {children}
    </div>
  </CustomButton>
)

const QLModeControls = () => {
  // store actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)
  const resetWidget = useStoreActions(actions => actions.resetWidget)

  // state
  const isReady = useStoreState((state) => state.isReady)
  const type = useStoreState((state) => state.type)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
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
        {isReady && (type === types.MAP ? <MapValueControls /> : <ValueControls />)}
      </div>
    </CustomAccordion>
  )
}

export default QLModeControls
