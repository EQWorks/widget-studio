import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'

import LinkedSelect from './linked-select'
import styles from '../styles'


const useStyles = makeStyles(styles)

const PluralLinkedSelect = ({ titles, values, primaryKey, secondaryKey, data, subData, callback, deleteCallback }) => {

  const classes = useStyles()
  const remainingValues = useMemo(() => data.filter((name) => !(values.map(v => v[primaryKey]).includes(name))), [data, primaryKey, values])
  return (
    <>
      <div className={classes.controlRow}>
        <Typography
          className={classes.linkedSelectPrimary}
          color='textSecondary'
          variant='body1'
        >
          {titles[0]}
        </Typography>
        <Typography
          className={classes.linkedSelectSub}
          color='textSecondary'
          variant='body1'
        >
          {titles[1]}
        </Typography>
      </div>
      <Divider className={classes.controlDivider} />
      {
        values.map((v, i) => {
          return (
            <LinkedSelect
              key={i}
              callback={([_k, _v]) => callback(i, { [primaryKey]: _k, [secondaryKey]: _v })}
              data={remainingValues}
              init={v[primaryKey]}
              subData={subData}
              subInit={v[secondaryKey]}
              deletable
              deleteCallback={() => deleteCallback(i)}
            />
          )
        })
      }
      <LinkedSelect
        controlled={false}
        callback={([_k, _v]) => callback(values.length, { [primaryKey]: _k, [secondaryKey]: _v })}
        data={remainingValues}
        init={''}
        subData={subData}
        subInit={''}
      />
    </>
  )
}

PluralLinkedSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  primaryKey: PropTypes.string.isRequired,
  secondaryKey: PropTypes.string.isRequired,
  titles: PropTypes.arrayOf(PropTypes.string),
  callback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired
}

PluralLinkedSelect.defaultProps = {
  titles: [],
}

export default PluralLinkedSelect
