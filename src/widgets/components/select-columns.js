import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import CustomSelect from './custom-select'
import { useStoreState, useStoreDispatch } from 'easy-peasy'

const SelectColumns = ({ columnsData }) =>  {
  const xAxis = useStoreState((state) => state.widgets.initState.xAxis)
  const yAxis = useStoreState((state) => state.widgets.initState.yAxis)
  const dispatch = useStoreDispatch()
  /**
   * this component only takes single values
   * yAxis is always multi so we need to get the first enum
  */

  return (
    <Grid container direction='column' alignItems='center'>
      <CustomSelect
        title='Column 1'
        data={columnsData}
        chosenValue={xAxis}
        setChosenValue={(value) => dispatch({
          type: 'WIDGETS',
          payload: { xAxis: value } }
        )}
      />
      <CustomSelect
        title='Column 2'
        data={columnsData}
        chosenValue={yAxis[0] || ''}
        setChosenValue={(value) => dispatch({
          type: 'WIDGETS',
          payload: { yAxis: [value] }
        })}
      />
    </Grid>
  )}

SelectColumns.propTypes = {
  columnsData: PropTypes.array,
}
SelectColumns.default = {
  columnsData: [],
}

export default SelectColumns
