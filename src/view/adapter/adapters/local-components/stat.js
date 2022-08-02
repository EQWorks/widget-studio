import React from 'react'
import PropTypes from 'prop-types'
import { getTailwindConfigColor, Icons, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
    height: '100%',
    padding: '2rem 3rem',

    '& .title-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: '1.3rem',
      color: getTailwindConfigColor('secondary-800'),
    },
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    '& .content-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& .item-container': {
        margin: '0.25rem 0',
        borderWidth: '0 2px 0 0',
        borderColor: 'black',

        '& .item': {
          padding: '0 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },

      '& .item-container:last-child': {
        borderRight: '0',
      },

      '& .is-vertical': {
        width: '100%',
        borderWidth: '0',
      },
    },

    '& .is-vertical': {
      flexDirection: 'column',
    },
  },
  value: {
    fontSize: '2.25rem',
    fontWeight: 600,
    color: getTailwindConfigColor('secondary-800'),
  },
  label: {
    fontSize: '1.5rem',
    color: getTailwindConfigColor('secondary-700'),
  },
  divider: {
    background: getTailwindConfigColor('secondary-300'),
    width: '1px',
    minWidth: '1px',
    height: '100%',
    margin: '0 2rem',
  },
  trendLabel: {
    marginTop: '0.625rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    color: getTailwindConfigColor('secondary-600'),

    '& .percentage-label': {
      display: 'flex',
      alignItems: 'center',
      letterSpacing: '1px',

      '& .icon-container': {
        marginRight: '0.313rem',
      },
    },

    '& .increased': {
      color: getTailwindConfigColor('success-500'),
    },

    '& .decreased': {
      color: getTailwindConfigColor('error-500'),
    },
  },
})

const Stat = ({ data, title, values, genericOptions, uniqueOptions }) => {
  const { showLabels, showCurrency, showWidgetTitle, showVertical } = genericOptions
  const { selectedTrend } = uniqueOptions

  const calculateTrend = (curr, versus) => {
    return versus > 0 ? ((Number(curr) - Number(versus)) / Number(versus)) * 100 : 100
  }

  const renderTrend = (value) => {
    if (value > 0) {
      return (
        <label className='percentage-label increased'>
          <div className="icon-container">
            <Icons.ArrowUpRegular size='md'/>
          </div>
          {value}%
        </label>
      )
    } else if (value < 0) {
      return (
        <label className='percentage-label decreased'>
          <div className="icon-container">
            <Icons.ArrowDownRegular size='md'/>
          </div>
          {Math.abs(value)}%
        </label>
      )
    } else {
      return (<label className='percentage-label'>0% </label>)
    }
  }

  const getMatchedTrend = (key) => {
    const selectedTrendObject = Object.keys(selectedTrend.value)
    let matchedTrend = 0

    selectedTrendObject.forEach(val => {
      if (val.includes(key)) {
        matchedTrend = selectedTrend.value[val]
      }
    })

    return matchedTrend
  }

  return (
    <div className={classes.outerContainer}>
      {showWidgetTitle && <div className="title-container">{title}</div>}
      <div className={classes.innerContainer}>
        <div className={`content-container ${showVertical && 'is-vertical'}`}>
          {
            values?.map(v => (
              <div key={v.title} className={`item-container ${showVertical && 'is-vertical'}`}>
                <div className='item'>
                  <div className={classes.value}>
                    {showCurrency && '$'}{Number(data[0][v.title]).toLocaleString('en-US', { maximumFractionDigits:2 })}
                  </div>
                  {showLabels &&
                    <div className={classes.label}>
                      {v.title}
                    </div>
                  }
                </div>
                { selectedTrend && selectedTrend.value &&
                  <div className={`trend-label-container ${classes.trendLabel}`}>
                    {renderTrend(Math.round(calculateTrend(data[0][v.title], getMatchedTrend(v.key))))}
                    &nbsp;vs {selectedTrend.title}
                  </div>
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

Stat.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  genericOptions: PropTypes.object.isRequired,
  uniqueOptions: PropTypes.object.isRequired,
}
export default Stat
