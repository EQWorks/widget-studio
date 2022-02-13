import React from 'react'

import { Icons } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderSection, renderRow } from '../shared/util'
import PluralLinkedSelect from '../../components/plural-linked-select'
import CustomSelect from '../../components/custom-select'
import SliderControl from './components/slider-control'


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

  return (
    <WidgetControlCard
      clear={() => resetValue({ filters, groupFilter })}
      title='Filters'
    >
      {
      // NOTE - temporary fix to remove some large spaces - to be adjusted after the styling revision
      // renderSection(
      //   null,
        renderRow(
          'Group Filter',
          <CustomSelect
            fullWidth
            multiSelect
            data={groups}
            value={groupFilter ?? []}
            onSelect={val => userUpdate({ groupFilter: val })}
            placeholder={group && domain.value ? `Filter ${domain.value}` : 'N/A'}
            disabled={!group || !domain.value}
          />
        )
      // )
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
                return (
                  <SliderControl
                    index={i}
                    style='chart'
                    update={filter => userUpdate({
                      filters:
                        filters.map((v, _i) => i === _i
                          ? { key: k, filter }
                          : v),
                    })}
                    range={true}
                  >
                  </SliderControl>
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
