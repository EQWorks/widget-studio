import React, { useMemo } from 'react'

import { DateRange, Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../store'
import WidgetControlCard from '../shared/components/widget-control-card'
import { renderSection, renderRow } from '../shared/util'
import PluralLinkedSelect from '../../components/plural-linked-select'
import CustomSelect from '../../components/custom-select'
import SliderControl from './components/slider-control'


const classes = makeStyles({
  dateRangeOuterContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  dateRangeHeader: {
    fontSize: '0.7rem',
    paddingLeft: '0.2rem',
    color: getTailwindConfigColor('secondary-500'),
  },
  dateRangeRoot: {
    width: '100%',
    display: 'flex',
    overflow: 'hidden !important',
    '> *': {
      marginRight: '0.6rem',
      flex: 1,
    },
    '> :last-child': {
      marginRight: '0px !important',
    },
  },
  dateRangeField: {
    width: '100%',
  },
  dateRangeInput: {
    cursor: 'pointer !important',
    fontSize: '0.7rem !important',
    color: getTailwindConfigColor('secondary-800'),
    width: '100%',
    overflow: 'hidden !important',
    borderRadius: '0.2rem',
    padding: '0.2rem',
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
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)
  const domain = useStoreState((state) => state.domain)
  const domainIsDate = useStoreState((state) => state.domainIsDate)

  const filterData = useMemo(() => (
    Object.fromEntries(Object.entries(columnsAnalysis)
      .filter(([, { min, max, isNumeric }]) => isNumeric && min !== max)
      .map(([c, { Icon }]) => [c, { Icon }]))
  ), [columnsAnalysis])

  const renderDateFilter = (
    <div className={classes.dateRangeOuterContainer}>
      <div className={classes.dateRangeRoot}>
        <span className={classes.dateRangeHeader}>Start</span>
        <span className={classes.dateRangeHeader}>End</span>
      </div>
      <DateRange
        showLabel={false}
        classes={{
          form: classes.dateRangeRoot,
          field: classes.dateRangeField,
          input: classes.dateRangeInput,
        }}
        defaultValue={groupFilter}
        setFromValue={v => userUpdate({ groupFilter: [v, groupFilter[1]] })}
        setToValue={v => userUpdate({ groupFilter: [groupFilter[0], v] })}
      />
    </div>
  )

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
          'Domain Filter',
          domainIsDate
            ? renderDateFilter
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
        // )
      }
      {renderSection(
        null,
        renderRow(
          'Range Filters',
          <>
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
          </>
        )
      )
      }
    </WidgetControlCard >
  )
}

export default Filters
