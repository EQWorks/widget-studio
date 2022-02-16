import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../store'
import Icons from '../shared/type-controls'
import WidgetControlCard from '../shared/components/widget-control-card'
import CustomAccordion from '../../components/custom-accordion'
import types from '../../constants/types'
import MapValueControls from '../shared/map-value-controls'
import ValueControls from '../shared/value-controls'
import CustomButton from '../../components/custom-button'
import DomainControls from '../shared/domain-controls'
import MapDomainControls from '../shared/map-domain-controls'


const QLModeControls = ({ children }) => {
  // store actions
  const update = useStoreActions(actions => actions.update)
  const resetWidget = useStoreActions(actions => actions.resetWidget)

  // state
  const type = useStoreState((state) => state.type)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const allowReset = useStoreState((state) => state.ui.allowReset)

  const footer = <>
    <div className='flex-1'>
      <CustomButton
        onClick={resetWidget}
        disabled={!allowReset}
      >
        reset
      </CustomButton>
    </div>
    {/* <CustomButton
      endIcon={<Icons.Save size='sm' />}
      variant='filled'
      onClick={() => alert('not implemented')}
      disabled={!allowReset}
    >
      save & update
    </CustomButton> */}
  </>

  return (
    <>
      {children}
      <CustomAccordion
        disabled={!dataReady}
        title={'Controls'}
        footer={footer}
        open={showWidgetControls}
        toggle={() => update({ ui: { showWidgetControls: !showWidgetControls } })}
      >
        <div className='flex flex-col w-full'>
          <WidgetControlCard title='Select Widget Type' >
            <Icons disabled={!dataReady} />
          </WidgetControlCard>
          {
            type === types.MAP
              ? <>
                <MapDomainControls />
                <MapValueControls />
              </>
              : <>
                <DomainControls />
                <ValueControls />
              </>
          }
        </div>
      </CustomAccordion>
    </>
  )
}

QLModeControls.propTypes = {
  children: PropTypes.node,
}
QLModeControls.defaultProps = {
  children: <></>,
}

export default QLModeControls
