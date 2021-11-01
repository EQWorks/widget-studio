import React, { useEffect, createElement } from 'react'

import { Icons as _Icons, Button } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import BarControls from './controls/bar-controls'
import PieControls from './controls/pie-controls'
import LineControls from './controls/line-controls'
import ScatterControls from './controls/scatter-controls'
import { Controls } from '../../components/icons'
import Icons from './icons'
import { useResizeDetector } from 'react-resize-detector'


const controls = {
  bar: BarControls,
  line: LineControls,
  pie: PieControls,
  scatter: ScatterControls,
}

const WidgetControls = () => {

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
      <div style={{ height: height }} className={`border-l border-neutral-100 py-px overflow-hidden transition-width duration-200 ease-in ${showWidgetControls ? 'w-0 border-l-none' : 'w-16 delay-500'}`}>
        <Button
          variant='borderless'
          className={'w-full justify-center border-none h-full'}
          onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
        >
          <Controls size='md' className='h-full stroke-current text-secondary-500 w-full p-5' />
        </Button>
      </div>
      <div ref={ref} className={`border-l border-neutral-100 transition-max-width overflow-x-hidden ease-in-out flex justify-end duration-1000 ${showWidgetControls ? 'max-w-full' : 'max-w-0'}`}>
        <div className={'p-5 overflow-x-hidden whitespace-nowrap'} >
          <div className={'flex items-center'}>
            <span className='flex-1 font-bold text-secondary-800' > Controls</span >
            <Button
              variant='borderless'
              className={`border-none ${showWidgetControls ? '' : 'h-full'}`}
              onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
            >
              <_Icons.Close size='md' className='fill-current text-secondary-500 h-min w-auto' />
            </Button>
          </div >
          <Icons disabled={!columns.length || !dataReady} />
          {
            dataReady &&
            <>
              {
                type && columns &&
                createElement(controls[type])
              }
              <div className={'p-2 flex justify-end'}>
                <Button
                  variant='borderless'
                  className='border-none'
                  onClick={resetWidget}
                >
                  <_Icons.Close size='md' className='fill-current text-secondary-500 h-min w-auto' />
                </Button>
              </div>
            </>
          }
        </div >
      </div>
    </>
  )
}

export default WidgetControls
