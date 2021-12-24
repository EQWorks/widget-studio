import React, { useEffect, createElement } from 'react'
import PropTypes from 'prop-types'

import { Button } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import BarControls from './types/bar'
import PieControls from './types/pie'
import LineControls from './types/line'
import ScatterControls from './types/scatter'
import MapControls from './types/map'
import { Controls, Save, Trash } from '../../components/icons'
import Icons from '../shared/widget-type-icons'
import WidgetControlCard from '../shared/widget-control-card'
import CustomAccordion from '../../components/custom-accordion'


const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
  map: MapControls,
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

const QLModeControls = () => {
  // store actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)
  const resetWidget = useStoreActions(actions => actions.resetWidget)

  // common state
  // state
  const columns = useStoreState((state) => state.columns)
  const type = useStoreState((state) => state.type)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const allowReset = useStoreState((state) => state.ui.allowReset)
  const controlsWidth = useStoreState((state) => state.ui.controlsWidth)

  useEffect(() => {
    update({ numericColumns: columns.filter(({ category }) => category === 'Numeric').map(({ name }) => name) })
    update({ stringColumns: columns.filter(({ category }) => category === 'String').map(({ name }) => name) })
  }, [columns, update])

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

QLModeControls.propTypes = {
  className: PropTypes.string,
}
QLModeControls.defaultProps = {
  className: '',
}

export default QLModeControls
