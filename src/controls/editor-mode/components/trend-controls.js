import React, { useMemo } from 'react'

import { TextField, Tooltip, Icons, makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState, useStoreActions } from '../../../store'
import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow, renderToggle, renderItem } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'


const classes = makeStyles({
  toggle: {
    margin: '.625rem 0 0 1.5rem',
  },
  row: {
    marginBottom: '.625rem',
  },
  benchmark: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.25rem',
    marginTop: '0.625rem',
    gap: '0.406rem',
  },
  tooltip: {
    marginBottom: '0.2rem',
  },
})

const TrendControls = () => {
  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const rows = useStoreState((state) => state.rows)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const transformedData = useStoreState((state) => state.transformedData)
  const groupFilter = useStoreState((state) => state.groupFilter)
  
  console.log('data: ', {rows, transformedData, domain, renderableValueKeys})
  const getValueKeys = renderableValueKeys.length ? renderableValueKeys.map(val => val.key) : []
  
  const parseTrendObject = () => {
    let getTrendObject = {}
    const availableTrend = []
    rows.forEach(row => {
      const objectKeys = Object.keys(row)
      objectKeys.forEach(k => {
        getValueKeys.forEach(v => {
          if (row[domain.value] === Number(groupFilter[0]) && k.includes(`${v}_`)) {
            const replace = k.replace(`${v}_`, '')

            if (!availableTrend.includes(replace)) {
              availableTrend.push(replace)
            }

            getTrendObject = {
              ...getTrendObject,
              [k]: row[k]
            }
          }
        })
      })
    })

    return {...getTrendObject, availableTrend}
  }

  const parseAvailableTrend = () => {
    const trendObject = parseTrendObject()
    let parsedTrend = {}

    const objectKeys = Object.keys(trendObject)
    objectKeys.forEach(k => {
      trendObject.availableTrend.forEach(v => {
        if (k.includes(`${v}`)) {
          parsedTrend = {
            ...parsedTrend,
            [v]: {
              ...parsedTrend[v],
              [k]: trendObject[k]
            }
          }
          }
      })
    })
    
    return parsedTrend
  }

  return (
    <MutedBarrier mute={!type || !domain.value || !renderableValueKeys.length || !groupFilter.length}>
      <WidgetControlCard
        title='Trend Config'
      >
        <CustomSelect         
          fullWidth
          simple
          data={Object.keys(parseAvailableTrend())}
          onSelect={val => {
            console.log('onSelect: ', parseAvailableTrend()[val])
          }}
        />
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default TrendControls
