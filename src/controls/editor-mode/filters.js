import React from 'react'

import { DateRange, Icons, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderSection, renderRow } from '../shared/util'
import PluralLinkedSelect from '../../components/plural-linked-select'
import RangeFilter from './components/range-filter'
import CustomSelect from '../../components/custom-select'
import CustomDropdown from './components/custom-dropdown'


const classes = makeStyles({
  dropdownMenu: {
    width: '12rem !important',
    overflow: 'visible !important',
  },
  dropdownRoot: {
    borderTopRightRadius: '0 !important',
    borderBottomRightRadius: '0 !important',
    borderRight: 'none !important',
  },
})

const Filters = () => {
  // common actions
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const resetValue = useStoreActions((state) => state.resetValue)

  // common state
  const group = useStoreState((state) => state.group)
  const groups = useStoreState((state) => state.groups)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const filters = useStoreState((state) => state.filters)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const domain = useStoreState((state) => state.domain)
  const domainIsDate = useStoreState((state) => state.domainIsDate)

  return (
    <WidgetControlCard
      clear={() => resetValue({ filters, groupFilter })}
      title='Filters'
    >
      {renderSection(
        null,
        renderRow(
          'Group Filter',
          domainIsDate
            ? <DateRange
              defaultValue={groupFilter}
              setFromValue={v => userUpdate({ groupFilter: [v, groupFilter[1]] })}
              setToValue={v => userUpdate({ groupFilter: [groupFilter[0], v] })}
            />
            : <CustomSelect
              fullWidth
              multiSelect
              data={groups}
              value={groupFilter ?? []}
              onSelect={val => userUpdate({ groupFilter: val })}
              placeholder={group && domain.value ? `Filter ${domain.value}` : 'N/A'}
              disabled={!group || !domain.value}
            />
        )
      )
      }
      {renderSection(
        null,
        renderRow(
          'Value Filter',
          <>
            <PluralLinkedSelect
              titles={['Column', 'Range']}
              headerIcons={[Icons.Columns, Icons.Hash]}
              values={filters}
              primaryKey='key'
              secondaryKey='filter'
              data={numericColumns.filter(c => {
                const { min, max, category } = columnsAnalysis[c] || {}
                return min !== max && category === 'Numeric'
              })}
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
                  <CustomDropdown
                    selectedString={
                      filter &&
                      (filter.map(Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        maximumFractionDigits: 1,
                      }).format)
                      ).join('-')
                    }
                    classes={{
                      root: classes.dropdownRoot,
                      menu: classes.dropdownMenu,
                    }}
                    placeholder='Range'
                    disabled={!filter}
                  >
                    <RangeFilter
                      min={min}
                      max={max}
                      value={filter || [min, max]}
                      update={filter => userUpdate({
                        filters:
                          filters.map((v, _i) => i === _i
                            ? { key: k, filter }
                            : v),
                      })}
                    />
                  </CustomDropdown>
                )
              }}
              addMessage='Add Range Filter'
            />
          </>
        )
      )
      }
    </WidgetControlCard >
  )
}

export default Filters
