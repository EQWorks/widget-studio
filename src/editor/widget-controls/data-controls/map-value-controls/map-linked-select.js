import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import { Typography } from '@eqworks/lumen-ui'
import { makeStyles } from '@material-ui/core/styles'

import LinkedSelect from '../../../shared-components/linked-select'

import styles from '../../../styles'


const useStyles = makeStyles(styles)

const MapLinkedSelect = ({ values, data, subData, callback }) => {
  const classes = useStyles()
  const remainingValues = useMemo(() => data.filter((name) =>
    !(values.map(v => v.key).includes(name))), [data, values])

  return (
    <>
      {
        values.map(({ key, agg, map_vis }, i) => (
          <>
            <div className={classes.controlRowMap}>
              <Typography
                className={classes.linkedSelectPrimary}
                color='textSecondary'
                variant='body1'
              >
                {map_vis.charAt(0).toUpperCase() + map_vis.slice(1)}
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
              key={map_vis}
              callback={([_k, _v]) => callback(i, { key: _k, agg: _v, map_vis: map_vis })}
              data={remainingValues}
              init={key}
              subData={subData}
              subInit={agg}
              deletable
              deleteCallback={() => callback(i, { key: '', agg: '', map_vis: map_vis })}
              type='map'
            />
          </>
        ))
      }
    </>
  )
}

export default MapLinkedSelect

MapLinkedSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
}
