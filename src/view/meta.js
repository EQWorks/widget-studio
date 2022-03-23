
import React, { useMemo } from 'react'

import { makeStyles, getTailwindConfigColor } from '@eqworks/lumen-labs'

import { useStoreState } from '../store'
import OverflowTooltip from '../components/overflow-tooltip'
import modes from '../constants/modes'


const useStyles = (mode, cols) => makeStyles({
  outerContainer: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    '& > *': {
      borderLeft: 'none',
      borderRight: `1px solid ${getTailwindConfigColor('secondary-300')}`,
    },
    ':last-child': {
      borderRight: 'none',
    },
    ...(mode === modes.QL && {
      color: getTailwindConfigColor('secondary-500'),
      fontSize: '0.714rem',
    }),
  },
})

const WidgetMeta = () => {
  // widget state
  const columns = useStoreState((state) => state.columns)
  const rows = useStoreState((state) => state.rows)

  // data source state
  const dataSourceType = useStoreState((state) => state.dataSource.type)
  const dataSourceID = useStoreState((state) => state.dataSource.id)
  const dataReady = useStoreState((state) => state.dataReady)

  // UI state
  const mode = useStoreState((state) => state.ui.mode)
  const dataSourceName = useStoreState((state) => state.ui.dataSourceName)

  // TODO this is mocked
  const detailItems = useMemo(() => ([
    // ['Created Date', '09/09/09 10:23 AM'],
    // ['Last Updated', '09/09/09 10:23 AM'],
    ['Data Volume', dataReady
      ? `${columns.length} column${columns.length !== 1 ? 's' : ''} ${rows.length} row${rows.length !== 1 ? 's' : ''}`
      : '...',
    ],
    ['Data Source',
      dataReady
        ? dataSourceName || `${dataSourceType} ${dataSourceID}`
        : '...',
    ],
  ]), [columns.length, dataReady, dataSourceID, dataSourceName, dataSourceType, rows.length])

  const classes = useStyles(mode, detailItems.length)

  return (
    <div className={classes.outerContainer}>
      {
        detailItems.map(([title, info, hyperlink], i) => {
          const config = 'flex-none whitespace-nowrap min-w-0 font-semibold flex-initial font-mono bg-secondary-200 p-0.5'
          return (
            <div key={i} className='flex pl-3 pr-3 flex-col'>
              <span className='m-0'>
                {`${title}:`}
              </span>
              <OverflowTooltip
                description={info}
                classes={{ content: 'whitespace-nowrap' }}
                position='top'
              >
                <div className='flex-none whitespace-nowrap min-w-0'>
                  {
                    hyperlink
                      ? <a href={hyperlink}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={`${config} font-bold text-primary-500 underline`}
                      > {info} </a>
                      : <span className={`${config} font-bold text-secondary-700`}>
                        {info}
                      </span>
                  }
                </div>
              </OverflowTooltip>
            </div >
          )
        }
        )
      }
    </div>
  )
}

export default WidgetMeta
