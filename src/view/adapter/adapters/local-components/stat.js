import React from 'react'
import PropTypes from 'prop-types'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
    height: '100%',
    padding: '2rem 3rem',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
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
        borderRight: '0'
      },

      '& .is-vertical': {
        width: '100%',
        borderWidth: '0'
      },
    },

    '& .is-vertical': {
      flexDirection: 'column'
    }
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
})

const Stat = ({ data, values, genericOptions }) => {
  const { showLabels, showCurrency } = genericOptions
  const vertical = true

  return (
    <div className={classes.outerContainer}>
      <div className={classes.innerContainer}>
        <div className={`content-container ${vertical && 'is-vertical'}`}>
          {
            values?.map((k) => (
              <div key={k} className={`item-container ${vertical && 'is-vertical'}`}>
                <div className='item'>
                  <div className={classes.value}>
                    {showCurrency && '$'}{Number(data[0][k]).toLocaleString('en-US', {maximumFractionDigits:2})}
                  </div>
                  {showLabels &&     
                    <div className={classes.label}>
                      {k}
                    </div>
                  }
                </div>
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
}
export default Stat
