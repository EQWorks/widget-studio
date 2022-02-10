import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, TextField } from '@eqworks/lumen-labs'
import Slider from '@material-ui/core/Slider'
import { useStoreState } from '../../../store'


const classes = makeStyles({
  controls: {
    width: '100%',
    padding: '1rem',
  },
  slider: {
    width: '100%',
    padding: '0 1rem',
  },
  inputs: {
    display: 'flex',
    '> *': {
      borderRadius: '0.425rem',
      marginRight: '1rem',
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
})

const RangeFilterControl = ({ index, update }) => {
  const filters = useStoreState((state) => state.filters)
  const columnsAnalysis = useStoreState((state) => state.columnsAnalysis)

  const value = useMemo(() => filters[index]?.filter || [min, max], [filters, index, max, min])
  const { min, max } = columnsAnalysis[filters[index]?.key] || {}

  return (
    <div className={classes.controls}>
      <div className={classes.slider}>
        <Slider
          defaultValue={value}
          onChangeCommitted={(_, newValue) => update(newValue)}
          max={max}
          min={min}
          valueLabelDisplay="auto"
        />
      </div>
      <div className={classes.inputs}>
        <TextField
          label="min"
          type="number"
          deleteButton={false}
          placeholder={min}
          value={(value || [])[0] || ''}
          onChange={_min => update([_min, max])}
        />
        <TextField
          label="max"
          type="number"
          deleteButton={false}
          placeholder={max}
          value={(value || [])[1] || ''}
          onChange={_max => update([min, _max])}
        />
      </div>
    </div >
  )
}

RangeFilterControl.propTypes = {
  index: PropTypes.number.isRequired,
  update: PropTypes.func.isRequired,
}

export default RangeFilterControl
