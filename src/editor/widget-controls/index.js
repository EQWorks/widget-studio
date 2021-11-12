import React, { createElement } from 'react'
import PropTypes from 'prop-types'

import { Button } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import BarControls from './controls/bar-controls'
import PieControls from './controls/pie-controls'
import LineControls from './controls/line-controls'
import ScatterControls from './controls/scatter-controls'
import { Controls, Save, Trash } from '../../components/icons'
import Icons from './icons'
import WidgetControlCard from '../shared-components/widget-control-card'
import CustomAccordion from '../../components/custom-accordion'


const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
}

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

const WidgetControls = () => {
  // actions
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)
  const resetWidget = useStoreActions(actions => actions.resetWidget)

  // state
  const type = useStoreState((state) => state.type)
  const columns = useStoreState((state) => state.columns)
  const dataReady = useStoreState((state) => state.dataReady)

  // ui state
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const allowReset = useStoreState((state) => state.ui.allowReset)
  const controlsWidth = useStoreState((state) => state.ui.controlsWidth)

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
      expandedWidth={controlsWidth}
      disabled={!dataReady}
      icon={Controls}
      title={'Controls'}
      footer={footer}
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
          createElement(controls[type || 'line'])
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
