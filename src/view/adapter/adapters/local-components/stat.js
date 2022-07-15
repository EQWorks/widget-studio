import React from 'react'
import PropTypes from 'prop-types'
import { getTailwindConfigColor, makeStyles } from '@eqworks/lumen-labs'


const classes = makeStyles({
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 3rem',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  // console.log('props: ', {data, values})
  // console.log('data: ', data[0])
  return (
    <div className={classes.outerContainer}>
      {
        values?.map((k, i) => (
          <div key={k}>
            <div className={classes.item}>
              <div className={classes.value}>
                {Number(data[0][k]).toLocaleString('en-US', {maximumFractionDigits:2})}
              </div>
              {showLabels &&     
                <div className={classes.label}>
                  {k}
                </div>
              }
            </div>
            {
              i < (values.length - 1) &&
              <div className={classes.divider} />
            }
          </div>
        ))
      }
    </div>
  )
}

Stat.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
}
export default Stat
