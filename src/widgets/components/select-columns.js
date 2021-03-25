import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import CustomSelect from './custom-select'


const SelectColumns = ({ columnsData, xAxis, yAxis }) =>  (
  <Grid container direction='column' alignItems='center'>
    <CustomSelect
      title='Key X'
      data={columnsData}
      chosenValue={xAxis}
      setChosenValue={'xAxis'}
    />
    <CustomSelect
      title='Key Y'
      data={columnsData}
      chosenValue={yAxis}
      setChosenValue={'yAxis'}
    />
  </Grid>
)

SelectColumns.propTypes = {
  columnsData: PropTypes.array,
  xAxis: PropTypes.string.isRequired,
  // setXAxis: PropTypes.func.isRequired,
  yAxis: PropTypes.string.isRequired,
  // setYAxis: PropTypes.func.isRequired
}
SelectColumns.default = {
  columnsData: [],
}

export default SelectColumns
