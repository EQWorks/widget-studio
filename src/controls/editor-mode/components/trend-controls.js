import React from 'react'

import { useStoreState, useStoreActions } from '../../../store'

import WidgetControlCard from '../../shared/components/widget-control-card'
import { renderRow } from '../../shared/util'
import MutedBarrier from '../../shared/muted-barrier'
import CustomSelect from '../../../components/custom-select'


const TrendControls = () => {
  const userUpdate = useStoreActions((state) => state.userUpdate)

  const domain = useStoreState((state) => state.domain)
  const type = useStoreState((state) => state.type)
  const rows = useStoreState((state) => state.rows)
  const renderableValueKeys = useStoreState((state) => state.renderableValueKeys)
  const groupFilter = useStoreState((state) => state.groupFilter)

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
              [k]: row[k],
            }
          }
        })
      })
    })

    return { ...getTrendObject, availableTrend }
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
            [v.replaceAll('_', ' ')]: {
              ...parsedTrend[v.replaceAll('_', ' ')],
              [k]: trendObject[k],
            },
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
        <div className="row-container">
          {(renderRow('Select a trend',
            <CustomSelect
              fullWidth
              simple
              data={Object.keys(parseAvailableTrend())}
              onSelect={val => {
                userUpdate({
                  uniqueOptions: {
                    selectedTrend: {
                      value: parseAvailableTrend()[val] ?? '',
                      title: val,
                    },
                  },
                })
              }}
              onClear={() => userUpdate({
                uniqueOptions: {
                  selectedTrend: {
                    value: '',
                  },
                },
              })}
              placeholder={'Select a Trend to compare'}
            />
          ))}
        </div>
      </WidgetControlCard>
    </MutedBarrier>
  )
}

export default TrendControls
