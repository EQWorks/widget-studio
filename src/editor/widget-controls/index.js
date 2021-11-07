import React, { useEffect, createElement } from 'react'
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
import { useResizeDetector } from 'react-resize-detector'
import WidgetControlCard from '../shared-components/widget-control-card'


const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
}

const WidgetControls = ({ className }) => {

  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)
  const update = useStoreActions(actions => actions.update)
  const resetWidget = useStoreActions(actions => actions.resetWidget)
  const type = useStoreState((state) => state.type)
  const columns = useStoreState((state) => state.columns)

  const showWidgetControls = useStoreState((state) => state.ui.showWidgetControls)
  const dataReady = useStoreState((state) => state.dataReady)

  const { height, ref } = useResizeDetector()

  useEffect(() => {
    update({ numericColumns: columns.filter(({ category }) => category === 'Numeric').map(({ name }) => name) })
    update({ stringColumns: columns.filter(({ category }) => category === 'String').map(({ name }) => name) })
  }, [columns, update])

  return (
    <>
      <div style={{ height }} className={`${className} relative z-10 border-l-2 border-neutral-100 overflow-hidden transition-width duration-200 ease-in ${showWidgetControls ? 'w-0 border-l-none' : 'w-16 delay-500'}`}>
        <CustomButton
          variant='borderless'
          className={'w-full justify-center border-none h-full'}
          onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
        >
          <Controls size='md' className='h-full stroke-current text-secondary-500 w-full p-5' />
        </CustomButton>
      </div>
      <div ref={ref} className={`${className} relative z-10 border-l-2 border-neutral-100 transition-max-width overflow-x-hidden ease-in-out flex justify-end duration-1000 ${showWidgetControls ? 'max-w-full' : 'max-w-0'}`}>
        <div className={'overflow-x-hidden'} >
          <div className={'px-4 py-3 border-b border-neutral-100 flex items-center'}>
            <span className='flex-1 font-bold text-secondary-800 text-md' >Controls</span >
            <CustomButton
              variant='borderless'
              className={`border-none ${showWidgetControls ? '' : 'h-full'}`}
              onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
            >
              <_Icons.Close size='md' className='fill-current text-secondary-500 h-min w-auto' />
            </CustomButton>
          </div >
          <div className='px-4 py-2'>
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
          </div >
        </div >
      </div>
    </>
  )
}

WidgetControls.propTypes = {
  className: PropTypes.string,
}
WidgetControls.defaultProps = {
  className: '',
}

export default WidgetControls
