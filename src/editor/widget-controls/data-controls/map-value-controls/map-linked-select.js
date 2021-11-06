import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import { Typography } from '@eqworks/lumen-ui'
import { makeStyles } from '@material-ui/core/styles'

import LinkedSelect from '../../../shared-components/linked-select'

import styles from '../../../styles'


const useStyles = makeStyles(styles)

const MapLinkedSelect = ({ categories, values, data, subData, callback, deleteCallback }) => {
  const classes = useStyles()
  const remainingValues = useMemo(() => data.filter((name) =>
    !(values.map(v => v.key).includes(name))), [data, values])

  return (
    categories.map((mapVis, i) => {
      const match = values.findIndex(v => v.mapVis === mapVis)
      const { key, agg } = match === -1 ? {} : values[match]
      return (
        <div key={i}>
          <div className={classes.controlRowMap}>
            <Typography
              className={classes.linkedSelectPrimary}
              color='textSecondary'
              variant='body1'
            >
              {mapVis.charAt(0).toUpperCase() + mapVis.slice(1)}
            </Typography>
            <Typography
              className={classes.linkedSelectSub}
              color='textSecondary'
              variant='body1'
            >
              {'Aggregation'}
            </Typography>
          </div>
          <Divider className={classes.controlDivider} />
          <LinkedSelect
            key={mapVis}
            callback={([_k, _v]) => callback(match, { key: _k, agg: _v, mapVis })}
            data={remainingValues}
            init={key}
            subData={subData}
            subInit={agg}
            clearable
            deleteCallback={() => deleteCallback(match)}
            type='map'
          />
        </div>
      )
    })
  )
}

export default MapLinkedSelect

MapLinkedSelect.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
}
