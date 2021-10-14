import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@eqworks/lumen-ui'
import LinkedSelect from './linked-select'

import styles from '../styles'


const useStyles = makeStyles(styles)

export const PluralLinkedSelect = ({ titles, values, primaryKey, secondaryKey, data, subData, update }) => {

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
              callback={([_k, _v]) => update(i, { [primaryKey]: _k, [secondaryKey]: _v })}
              data={remainingValues}
              init={v[primaryKey]}
              subData={subData}
              subInit={v[secondaryKey]}
            />
          )
        })
      }
      < LinkedSelect
        controlled={false}
        callback={([_k, _v]) => update(values.length, { [primaryKey]: _k, [secondaryKey]: _v })}
        data={remainingValues}
        init={''}
        subData={subData}
        subInit={''}
      />
    </>
  )
}

PluralLinkedSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  subData: PropTypes.arrayOf(PropTypes.string),
  primaryKey: PropTypes.string,
  secondaryKey: PropTypes.string,
  titles: PropTypes.arrayOf(PropTypes.string),
  update: PropTypes.func,
  values: PropTypes.object
}

export default PluralLinkedSelect
