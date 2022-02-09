import React, { useEffect } from 'react'

import { Icons, makeStyles } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderSection, renderRow } from './util'
import PluralLinkedSelect from '../../components/plural-linked-select'
import RangeFilter from './components/range-filter'
import CustomSelect from '../../components/custom-select'
import types from '../../constants/types'
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
  const update = useStoreActions((state) => state.update)
  const resetValue = useStoreActions((state) => state.resetValue)

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
  const domain = useStoreState((state) => state.domain)

  useEffect(() => {
    update({ groupFilter: [] })
  }, [domain.value, update])

  return (
    <WidgetControlCard
      clear={() => resetValue({ filters, groupFilter })}
      title='Filters'
    >
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
                  update({ filters: filters.concat([{ key: null, filter: null }]) })
                } else if (!key) {
                  update({ filters: filters.map((v, _i) => i === _i ? { key: null, filter: null } : v) })
                } else if (filters[i]?.key !== key) {
                  const { min, max } = columnsAnalysis[key] || {}
                  update({ filters: filters.map((v, _i) => i === _i ? { key, filter: [min, max] } : v) })
                }
              }}
              deleteCallback={(i) => {
                const filtersCopy = JSON.parse(JSON.stringify(filters))
                filtersCopy.splice(i, 1)
                update({ filters: filtersCopy })
              }}
              customRenderSecondary={(i, k) => {
                const value = filters[i]?.filter
                return (
                  <CustomDropdown
                    selectedString={
                      value &&
                      (value.map(Intl.NumberFormat('en-US', {
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
                    disabled={!value}
                  >
                    <RangeFilter
                      index={i}
                      update={filter => update({
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
