import React, { useEffect, createElement } from 'react'

import { Icons as _Icons, Button } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import BarControls from './controls/bar-controls'
import PieControls from './controls/pie-controls'
import LineControls from './controls/line-controls'
import ScatterControls from './controls/scatter-controls'
import { Controls } from '../../components/icons'
import Icons from './icons'


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

  useEffect(() => {
    update({ numericColumns: columns.filter(({ category }) => category === 'Numeric').map(({ name }) => name) })
    update({ stringColumns: columns.filter(({ category }) => category === 'String').map(({ name }) => name) })
  }, [columns, update])

  return (
    <div className='flex flex-col items-center justify-center border border-neutral-100 p-5' >
      {
        showWidgetControls
          ? <div className={'w-full flex flex-row items-center'}>
            <span className='flex-1 font-bold text-secondary-800' > Controls</span >
            <Button
              variant='borderless'
              className={`border-none ${showWidgetControls ? '' : 'h-full'}`}
              onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
            >
              <_Icons.Close size='md' className='fill-current text-secondary-500 h-min w-auto' />
            </Button>
          </div >
          : <Button
            variant='borderless'
            className={'absolute border-none h-full'}
            onClick={() => nestedUpdate({ ui: { showWidgetControls: !showWidgetControls } })}
          >
            <Controls size='md' className='h-full stroke-current text-secondary-500 w-5' />
          </Button>
      }
      <div className={`${showWidgetControls ? 'w-auto' : 'pointer-events-none w-0 whitespace-nowrap overflow-hidden'}`} >
        {
          dataReady &&
          <>
            <Icons disabled={!columns.length} />
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
      </div>
    </div >
  )
}

export default WidgetControls
