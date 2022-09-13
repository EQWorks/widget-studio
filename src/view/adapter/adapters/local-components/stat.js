import React from 'react'
import PropTypes from 'prop-types'
import { getTailwindConfigColor, Icons, makeStyles } from '@eqworks/lumen-labs'
import { capitalize } from '../../../../util/string-manipulation'
import clsx from 'clsx'


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
      fontSize: '1.5rem',
      color: getTailwindConfigColor('secondary-700'),
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
        margin: '0.5rem 0',
        padding: '0 1.25rem',
        borderWidth: '0 1px 0 0',
        borderColor: getTailwindConfigColor('neutral-100'),

        '& .item-wrapper': {
          display: 'flex',
          flexDirection: 'column',

          '& .item': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },

          '& .is-percentage': {
            width: '240px',
            margin: '0.5rem 0',
            padding: '0 1.25rem',
            borderWidth: '0 1px 0 0',
            borderColor: getTailwindConfigColor('neutral-100'),
          },

          '& .label-top': {
            flexDirection: 'column-reverse',
          },

          '& .label-bottom': {
            flexDirection: 'column',
          },

          '& .is-percentage:last-child, .single-vertical, .multiple-horizontal': {
            borderRight: '0',
          },
        },

        '& .single-value': {
          flexDirection: 'row',
        },

        '& .multiple-vertical': {
          flexDirection: 'row',
          justifyContent: 'center',
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
    fontWeight: 700,
    color: getTailwindConfigColor('secondary-800'),
  },
  label: {
    width: '100%',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 300,
    color: getTailwindConfigColor('secondary-700'),
    wordWrap: 'break-word',
  },
  divider: {
    background: getTailwindConfigColor('secondary-300'),
    width: '1px',
    minWidth: '1px',
    height: '100%',
    margin: '0 2rem',
  },
  trendLabel: {
    marginTop: '0.75rem',
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

const conditionalClasses = ({ showVertical, values, labelPosition, selectedPercentage, index }) => ({
  contentContainer: clsx('content-container', { 'is-vertical': showVertical }),
  itemContainer: clsx('item-container', { 'is-vertical': showVertical }),
  itemWrapper: clsx('item-wrapper', { 'multiple-vertical': showVertical && values.length > 1 },
    { 'single-value': values.length === 1 && !showVertical }),
  item: clsx(`item label-${labelPosition.toLowerCase()}`,
    { 'is-percentage': selectedPercentage && selectedPercentage.values[index] },
    { 'single-vertical': showVertical && values.length === 1 },
    { 'multiple-horizontal': !showVertical && values.length > 1 }
  ),
})

const Stat = ({ data, title, values, formatData, genericOptions, uniqueOptions }) => {
  const { showLabels, showCurrency, showWidgetTitle, showVertical, labelPosition } = genericOptions
  const { compareTrend, selectedPercentage } = uniqueOptions

  const _conditionalClasses = (index = null) => conditionalClasses({ showVertical, values, labelPosition, selectedPercentage, index })

  const renderValue = (val, ob) => {
    if (val) {
      return `${((data[0][ob.title] / val) * 100).toFixed(2)}%`
    }
  }

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
    }

    return (<label className='percentage-label'>0% </label>)
  }

  const getMatchedTrend = (index) => {
    let matchedTrend = null

    if (compareTrend.value[compareTrend.value.selectedTrend[index]]) {
      matchedTrend = compareTrend.value[compareTrend.value.selectedTrend[index]]
    }

    return matchedTrend
  }

  const getTitle = (title, label) => {
    let _title = capitalize(title.replaceAll('_', ' '))
    if (label) {
      _title = _title.replaceAll(`${label} `, '')
    }
    return _title
  }

  return (
    <div className={classes.outerContainer}>
      {showWidgetTitle && <div className="title-container">{title}</div>}
      <div className={classes.innerContainer}>
        <div className={_conditionalClasses().contentContainer}>
          {
            values?.map((v, i) => (
              <div key={v.title} className={_conditionalClasses().itemContainer}>
                {data[0][v.title] &&
                  <div className={_conditionalClasses().itemWrapper}>
                    <div className={_conditionalClasses(i).item}>
                      <div className={classes.value}>
                        {showCurrency && '$'}
                        {typeof formatData[v.title] === 'function' ?
                          formatData[v.title](data[0][v.title]) :
                          Number(data[0][v.title]).toLocaleString('en-US', { maximumFractionDigits: 2 })
                        }
                      </div>
                      {showLabels &&
                          <div className={classes.label}>
                            {v.title}
                          </div>
                      }
                    </div>
                    {(selectedPercentage && selectedPercentage.values[i]) &&
                        <div className={_conditionalClasses(i).item}>
                          <div className={classes.value}>
                            {showCurrency && '$'}{renderValue(Number(selectedPercentage.values[i]), v)}
                          </div>
                          {showLabels &&
                            <div className={classes.label}>
                              {getTitle(selectedPercentage.titles[i])} {selectedPercentage && selectedPercentage.values[i] && '(%)'}
                            </div>
                          }
                        </div>
                    }
                  </div>
                }
                { compareTrend && compareTrend.value && getMatchedTrend(i) && data[0][v.title] &&
                  <div className={`trend-label-container ${classes.trendLabel}`}>
                    {renderTrend(Math.round(calculateTrend(data[0][v.title], getMatchedTrend(i))))}
                    &nbsp;vs. {getTitle(compareTrend.value.selectedTrend[i], v.title)}
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
  formatData: PropTypes.objectOf(PropTypes.func),
  genericOptions: PropTypes.object.isRequired,
  uniqueOptions: PropTypes.object.isRequired,
}
export default Stat
