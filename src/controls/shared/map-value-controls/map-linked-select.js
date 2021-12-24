import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import { Typography } from '@eqworks/lumen-ui'

import LinkedSelect from '../../../components/linked-select'


const MapLinkedSelect = ({
  categories,
  values,
  titles,
  // primaryKey,
  // secondaryKey,
  data,
  subData,
  // disableSubFor,
  // disableSubMessage,
  callback,
  deleteCallback,
}) => {
  const remainingValues = useMemo(() => data.filter((name) =>
    !(values.map(v => v.key).includes(name))), [data, values])

  return (
    categories.map((mapVis, i) => {
      const match = values.findIndex(v => v.mapVis === mapVis)
      const { key, agg } = match === -1 ? {} : values[match]
      return (
        <div key={i}>
          <div>
            <Typography
              color='textSecondary'
              variant='body1'
            >
              {mapVis.charAt(0).toUpperCase() + mapVis.slice(1)}
            </Typography>
            <Typography
              color='textSecondary'
              variant='body1'
            >
              {'Aggregation'}
            </Typography>
          </div>
          <Divider />
          <LinkedSelect
            key={mapVis}
            callback={([_k, _v]) => callback(match, { key: _k, agg: _v, mapVis })}
            data={remainingValues}
            init={key}
            subData={subData}
            subInit={agg}
            clearable
            deleteCallback={() => deleteCallback(match)}
            // className={`${i > 0 ? 'mt-2' : ''}`}
            // init={values[i]?.[primaryKey]}
            // subInit={values[i]?.[secondaryKey]}
            placeholders={titles}
            // disableSub={disableSubFor.includes(values[i]?.[primaryKey])}
            // disableSubMessage={`${values[i]?.[primaryKey]} ${disableSubMessage}`}
          />
        </div>
      )
    })
  )
}

export default MapLinkedSelect

MapLinkedSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  subData: PropTypes.arrayOf(PropTypes.string).isRequired,
  callback: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
}
