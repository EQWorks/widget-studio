import React from 'react'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/widget-control-card'
import { renderSection, renderRow } from './util'
import PluralLinkedSelect from '../../components/plural-linked-select'
import FilterDropdown from './filter-dropdown'
import CustomSelect from '../../components/custom-select'
import types from '../../constants/types'


const Filters = () => {
  // common actions
  const update = useStoreActions((state) => state.update)

  // common state
  const type = useStoreState((state) => state.type)
  const group = useStoreState((state) => state.group)
  const groups = useStoreState((state) => state.groups)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const mapGroupKey = useStoreState((state) => state.mapGroupKey)
  const groupKey = useStoreState((state) => state.groupKey)
  const filters = useStoreState((state) => state.filters)
  const numericColumns = useStoreState((state) => state.numericColumns)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)

  return (
    <WidgetControlCard title='Filters'>
      {renderSection(
        null,
        renderRow(
          'Group Filter',
          <CustomSelect
            fullWidth
            multiSelect
            data={groups}
            value={groupFilter ?? []}
            onSelect={val => update({ groupFilter: val })}
            placeholder={group ? `Filter ${type === types.MAP ? mapGroupKey : groupKey}` : 'N/A'}
            disabled={!group}
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
              values={filters}
              primaryKey='key'
              secondaryKey='range'
              data={numericColumns.filter(c => {
                const { min, max, category } = columnsAnalysis[c] || {}
                return min !== max && category === 'Numeric'
              })}
              subData={[]}
              callback={(i, { key, filter }) => {
                const { min, max } = columnsAnalysis[key] || {}
                const newFilter = {
                  key,
                  filter: key && !filter
                    ? [min, max]
                    : filter,
                }
                update({
                  filters: i === filters.length
                    ? filters.concat([newFilter])
                    : filters.map((v, _i) => i === _i ? newFilter : v),
                })
              }}
              deleteCallback={(i) => {
                const filtersCopy = JSON.parse(JSON.stringify(filters))
                filtersCopy.splice(i, 1)
                update({ filters: filtersCopy })
              }}
              customRenderSecondary={(i, k) => (
                <FilterDropdown
                  update={filter => update({
                    filters:
                    filters.map((v, _i) => i === _i
                      ? { key: k, filter }
                      : v),
                  })}
                  column={k}
                />
              )}
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