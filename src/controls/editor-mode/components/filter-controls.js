import React, { useCallback, useState } from 'react'

import clsx from 'clsx'
import { Icons } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import CustomSelect from '../../../components/custom-select'
import CustomSlider from '../../../components/custom-slider'
import CustomButton from '../../../components/custom-button'
import WidgetControlCard from '../../shared/widget-control-card'
import ToggleableWidgetControlCard from '../../shared/toggleable-widget-control-card'


const FilterControls = () => {

  const [addingFilter, setAddingFilter] = useState(false)
  const [disabledFilters, setDisabledFilters] = useState({})

  // common actions
  const update = useStoreActions(actions => actions.update)
  const nestedUpdate = useStoreActions(actions => actions.nestedUpdate)

  // common state
  const filters = useStoreState((state) => state.filters)
  const rows = useStoreState((state) => state.rows)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const dataReady = useStoreState((state) => state.dataReady)

  // ui state
  const showFilterControls = useStoreState((state) => state.ui.showFilterControls)

  const min = useCallback((key) => Math.min.apply(null, rows.map(r => r[key])), [rows])
  const max = useCallback((key) => Math.max.apply(null, rows.map(r => r[key])), [rows])

  const card = (key, range, enabled) => {
    return <ToggleableWidgetControlCard key={key}
      ignore
      init={enabled}
      title={key}
      callback={(val) => {
        if (!val) {
          const { [key]: _range, ...remainingFilters } = filters
          update({ filters: remainingFilters })
          setDisabledFilters({ ...{ [key]: _range }, ...disabledFilters })
        } else {
          const { [key]: _range, ...remainingFilters } = disabledFilters
          nestedUpdate({ filters: { [key]: _range } })
          setDisabledFilters(remainingFilters)
        }
      }}
      className='h-full'
    >
      <div className='flex flex-col'>
        <div className='mr-1 text-secondary-600'>
          {`${range[0]}-${range[1]}`}
        </div>
        <CustomSlider
          min={min(key)}
          max={max(key)}
          value={range}
          callback={val => nestedUpdate({ filters: { [key]: val } })}
        />
      </div>
    </ToggleableWidgetControlCard >
  }

  return (
    <>
      <div className='top-10 relative w-full flex items-end'>
        <div className={clsx('flex flex-col z-50 transition-height ease-in-out duration-300 absolute w-full overflow-hidden', {
          'h-60': showFilterControls,
          'h-10': !showFilterControls,
        })}>
          <div className={clsx('border bg-white flex-1 w-full transition-filter duration-1000 ease-in-out', {
            'filter blur-sm': !dataReady,
            'h-10': !showFilterControls,
          }
          )}>
            <div className='w-full h-full flex flex-col items-center'>
              <CustomButton
                className='h-10 children:flex-1 border-none w-full flex flex-row items-center'
                variant='borderless'
                onClick={() => nestedUpdate({ ui: { showFilterControls: !showFilterControls } })}
              >
                <div className='px-3 flex w-full items-center'>
                  <div className='text-left flex-1 font-bold text-secondary-800 text-md' >Filters</div >
                  <Icons.Close size='md' className={clsx('fill-current text-secondary-500 transition-opacity duration-300 ease-in-out', {
                    'opacity-1': showFilterControls,
                    'opacity-0': !showFilterControls,
                  })} />
                </div>
              </CustomButton>
              <div className={clsx('flex-1 w-full grid grid-cols-3 gap-3 p-3 pt-0 flex items-stretch transition-opacity duration-1000 delay-400 ease-in-out', {
                'hidden': !showFilterControls,
                'visible': showFilterControls,
              })}>
                {Object.entries(filters).map(([key, range]) =>
                  <div key={key}>
                    {
                      card(key, range, true)
                    }
                  </div>
                )}
                {Object.entries(disabledFilters).map(([key, range]) => card(key, range, false))}
                {
                  addingFilter || !Object.values(filters).length ?
                    <WidgetControlCard ignore>
                      <CustomSelect
                        data={numericColumns.filter(col => !Object.keys(filters).includes(col))}
                        onSelect={val => {
                          nestedUpdate({ filters: { [val]: [min(val), max(val)] } })
                          setAddingFilter(false)
                        }}
                      />
                    </WidgetControlCard>
                    :
                    <CustomButton
                      className='h-full bg-secondary-200 fill-current text-secondary-700'
                      onClick={() => setAddingFilter(true)}
                    >
                      <Icons.Add size='lg' className='w-full' />
                    </CustomButton>
                }
              </div>
            </div>
          </div >
        </div>
      </div>
    </>
  )
}

export default FilterControls
