import React from 'react'
import PropTypes from 'prop-types'

import { useStoreState, useStoreActions } from '../../store'
import WidgetTypeControls from '../shared/type-controls'
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
  const rows = useStoreState((state) => state.rows)
  const columns = useStoreState((state) => state.columns)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const allowReset = useStoreState((state) => state.ui.allowReset)

  const footer = <>
    <CustomButton
      onClick={resetWidget}
      disabled={!allowReset}
    >
        reset all
    </CustomButton>
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
        disabled={!dataReady || (!(rows?.length) && !(columns?.length))}
        title={'Controls'}
        footer={footer}
        open={showWidgetControls}
        toggle={() => update({ ui: { showWidgetControls: !showWidgetControls } })}
      >
        <div className='flex flex-col w-full'>
          <WidgetTypeControls />
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
