import React, { createElement } from 'react'
import PropTypes from 'prop-types'

import { Icons as _Icons } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import BarControls from './controls/bar-controls'
import PieControls from './controls/pie-controls'
import LineControls from './controls/line-controls'
import ScatterControls from './controls/scatter-controls'
import { Controls } from '../../components/icons'
import CustomButton from '../../components/custom-button'
import Icons from './icons'
import WidgetControlCard from '../shared-components/widget-control-card'
import CustomAccordion from '../../components/custom-accordion'


const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
}

const WidgetControls = () => {
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)
  const resetWidget = useStoreActions(actions => actions.resetWidget)
  const type = useStoreState((state) => state.type)
  const columns = useStoreState((state) => state.columns)
  const dataReady = useStoreState((state) => state.dataReady)
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)

  return (
    <CustomAccordion
      icon={Controls}
      title={'Controls'}
      open={showWidgetControls}
      toggle={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
    >
      <div className='flex flex-col'>
        <WidgetControlCard
          title='Select Widget Type'
          clearable
        >
          <Icons disabled={!columns.length || !dataReady} />
        </WidgetControlCard>

        {
          dataReady &&
          <>
            {
              type && columns &&
              createElement(controls[type])
            }
            <div className={'p-2 flex justify-end'}>
              <CustomButton
                variant='borderless'
                className='border-none'
                onClick={resetWidget}
              >
                <_Icons.Close size='md' className='fill-current text-secondary-500 h-min w-auto' />
              </CustomButton>
            </div>
          </>
        }
      </div>
    </CustomAccordion>
  )
}

WidgetControls.propTypes = {
  className: PropTypes.string,
}
WidgetControls.defaultProps = {
  className: '',
}

export default WidgetControls
