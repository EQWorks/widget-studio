import React, { useMemo } from 'react'

import {  Icons } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../../store'
import WidgetControlCard from '../../../shared/components/widget-control-card'
import { renderSection, renderRow } from '../../../shared/util'
import PluralLinkedSelect from '../../../../components/plural-linked-select'
import CustomSelect from '../../../../components/custom-select'
import SliderControl from '../../components/slider-control'
import DateDomainFilter from './date-domain-filter'


const Filters = () => {
  // common actions
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const resetValue = useStoreActions((state) => state.resetValue)

  // common state
  const group = useStoreState((state) => state.group)
  const groups = useStoreState((state) => state.groups)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const filters = useStoreState((state) => state.filters)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const domain = useStoreState((state) => state.domain)
  const domainIsDate = useStoreState((state) => state.domainIsDate)

  const filterData = useMemo(() => (
    Object.fromEntries(Object.entries(columnsAnalysis)
      .filter(([, { min, max, isNumeric }]) => isNumeric && min !== max)
      .map(([c, { Icon }]) => [c, { Icon }]))
  ), [columnsAnalysis])

  const renderGroupFilter = (
    domainIsDate
      ? <DateDomainFilter/>
      : <CustomSelect
        fullWidth
        multiSelect
        data={groups}
        value={groupFilter ?? []}
        onSelect={val => userUpdate({ groupFilter: val })}
        placeholder={group && domain.value ? `Select ${domain.value}(s) to display` : 'N/A'}
        disabled={!group || !domain.value}
      />
  )

  const renderRangeFilters = (
    <PluralLinkedSelect
      titles={['Column', 'Range']}
      headerIcons={[Icons.Columns, Icons.Hash]}
      values={filters}
      primaryKey='key'
      secondaryKey='filter'
      valueIcons={Object.values(filterData).map(({ Icon }) => Icon)}
      data={Object.keys(filterData)}
      subData={[]}
      callback={(i, { key }) => {
        if (i === filters.length) {
          userUpdate({ filters: filters.concat([{ key: null, filter: null }]) })
        } else if (!key) {
          userUpdate({ filters: filters.map((v, _i) => i === _i ? { key: null, filter: null } : v) })
        } else if (filters[i]?.key !== key) {
          const { min, max } = columnsAnalysis[key] || {}
          userUpdate({ filters: filters.map((v, _i) => i === _i ? { key, filter: [min, max] } : v) })
        }
      }}
      deleteCallback={(i) => {
        const filtersCopy = JSON.parse(JSON.stringify(filters))
        filtersCopy.splice(i, 1)
        userUpdate({ filters: filtersCopy })
      }}
      customRenderSecondary={(i, k) => {
        const { key, filter } = filters[i] || {}
        const { min, max } = columnsAnalysis[key] || {}
        return (
          <SliderControl
            style='chart'
            range={true}
            min={min}
            max={max}
            value={filter || [min, max]}
            disabled={!filter}
            update={filter => userUpdate({
              filters:
                filters.map((v, _i) => i === _i
                  ? { key: k, filter }
                  : v),
            })}
          >
          </SliderControl>
        )
      }}
      addMessage='Add Range Filter'
    />
  )

  return (
    <WidgetControlCard
      clear={() => resetValue({ filters, groupFilter })}
      title='Filters'
    >
      {
        renderSection(
          null,
          <>
            {renderRow('Group Filter', renderGroupFilter)}
            {renderRow('Range Filters', renderRangeFilters)}
          </>
        )
      }
    </WidgetControlCard >
  )
}

export default Filters
