import React, { useCallback, useState } from 'react'

import { Icons } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import ToggleableCard from '../../shared-components/toggleable-card'
import CustomSelect from '../../../components/custom-select'
import CustomSlider from '../../shared-components/custom-slider'
import WidgetControlCard from '../../shared-components/widget-control-card'
import CustomButton from '../../../components/custom-button'
import { Filter } from '../../../components/icons'


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
    return <ToggleableCard key={key}
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
    </ToggleableCard >
  }

  return (
    <>
      <div className={`relative z-10 border-neutral-100 overflow-hidden ${showFilterControls ? 'transition-height duration-200 ease-in-out h-0 border-t-none' : 'h-16 border-t-2'}`}>
        <CustomButton
          variant='borderless'
          className={'w-full justify-center border-none h-full'}
          onClick={() => nestedUpdate({ ui: { showFilterControls: !showFilterControls } })}
        >
          <Filter size='md' className='h-full stroke-current text-secondary-500 w-full p-5' />
        </CustomButton>
      </div>
      <div className={`w-full relative z-10 border-neutral-100 overflow-hidden ${showFilterControls ? 'h-auto border-t-2' : 'h-0 border-none'}`}>
        {
          !dataReady &&
          <div className='absolute z-30 bg-secondary-50 opacity-50 w-full h-full' />
        }
        <div className={`w-full overflow-y-hidden transition-filter duration-1000 ease-in-out ${!dataReady ? 'filter blur-sm' : ''}`} >
          <div className={'px-2 py-3 flex flex-col items-center'}>
            <div className='w-full flex flex-row'>
              <span className='flex-1 font-bold text-secondary-800 text-md' >Filters</span >
              <CustomButton
                variant='borderless'
                className='border-none'
                onClick={() => nestedUpdate({ ui: { showFilterControls: !showFilterControls } })}
              >
                <Icons.Close size='md' className='fill-current text-secondary-500' />
              </CustomButton>
            </div>
            <div className='w-full grid grid-cols-3 gap-3 p-3'>
              {Object.entries(filters).map(([key, range]) => card(key, range, true))}
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
          </div >
        </div >
      </div >
    </>
  )
}

export default FilterControls
