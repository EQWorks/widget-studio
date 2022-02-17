import React, { useMemo } from 'react'

import { makeStyles } from '@eqworks/lumen-labs'
import { DateRange } from 'react-date-range'

import { useStoreState, useStoreActions } from '../../../store'
import CustomDropdown from '../components/custom-dropdown'
import { dateToShortString, dateToYYYYMMDD, YYYYMMDDToDate } from '../../../util/time'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'


const classes = makeStyles({
  dateDropdownContent: {
    direction: 'ltr',
  },
  dateDropdownMenu: {
    direction: 'ltr',
    maxHeight: '30rem !important',
  },
  dateFilter: {
    width: '100%',
    direction: 'rtl',
  },
})

const DateDomainFilter = () => {
  const userUpdate = useStoreActions((state) => state.userUpdate)
  const rows = useStoreState((state) => state.rows)
  const groupFilter = useStoreState((state) => state.groupFilter)
  const domain = useStoreState((state) => state.domain)
  const domainIsDate = useStoreState((state) => state.domainIsDate)

  const [minDate, maxDate] = useMemo(() => (
    [Math.min, Math.max]
      .map(fn => new Date(fn.apply(null,
        rows.map(r => new Date(r[domain.value]))
      )))
  ), [domain.value, rows])

  const { startDate, endDate } = useMemo(() => {
    const [start, end] = groupFilter
    return start && end
      ? {
        startDate: YYYYMMDDToDate(start),
        endDate: YYYYMMDDToDate(end),
      }
      : {}
  }, [groupFilter])

  const dateRangeString = useMemo(() => (
    startDate && endDate
      ? [startDate, endDate].map(dateToShortString).join(' - ')
      : ''
  ), [startDate, endDate])

  return (
    <div className={classes.dateFilter}>
      <CustomDropdown
        selectedString={dateRangeString}
        classes={{
          menu: classes.dateDropdownMenu,
          content: classes.dateDropdownContent,
        }}
        disabled={!domainIsDate}
        {...(!domainIsDate && { placeholder: 'N/A' })}
      >
        {
          domainIsDate &&
          <DateRange
            className={classes.dateRangeRoot}
            minDate={minDate}
            maxDate={maxDate}
            ranges={[startDate && endDate
              ? { startDate, endDate }
              : { startDate: new Date(), endDate: new Date() },
            ]}
            onChange={({ range1: { startDate: _startDate, endDate: _endDate } }) => {
              if (_startDate >= minDate && _startDate <= maxDate
                && _endDate >= minDate && _endDate <= maxDate) {
                userUpdate({ groupFilter: [_startDate, _endDate].map(dateToYYYYMMDD) })
              }
            }}
          />
        }
      </CustomDropdown>
    </div>
  )
}

export default DateDomainFilter
