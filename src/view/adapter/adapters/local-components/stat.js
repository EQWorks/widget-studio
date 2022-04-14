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
    color: getTailwindConfigColor('secondary-900'),
  },
  value: {
    fontSize: '3rem',
    fontWeight: 600,
  },
  label: {
    paddingLeft: '0.1rem',
  },
  divider: {
    background: getTailwindConfigColor('secondary-300'),
    width: '1px',
    minWidth: '1px',
    height: '100%',
    margin: '0 2rem',
  },
})

const Stat = ({ data, values }) => {
  return (
    <div className={classes.outerContainer}>
      {
        values?.map((k, i) => (
          <>
            <div key={k} className={classes.item}>
              <div className={classes.value}>
                {data[0][k]}
              </div>
              <div className={classes.label}>
                {k}
              </div>
            </div>
            {
              i < (values.length - 1) &&
              <div className={classes.divider} />
            }
          </>
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
