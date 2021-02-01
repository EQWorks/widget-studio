import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import CustomSelect from './custom-select'


const SelectColumns = ({ columnsData, xAxis, setXAxis, yAxis, setYAxis }) => (
  <Grid container direction='column' alignItems='center'>
    <CustomSelect
      title='Axis X'
      data={columnsData}
      chosenValue={xAxis}
      setChosenValue={setXAxis}
    />
    <CustomSelect
      multi
      title='Axis Y'
      data={columnsData}
      chosenValue={yAxis}
      setChosenValue={setYAxis}
    />
  </Grid>
)

SelectColumns.propTypes = {
  columnsData: PropTypes.array,
  xAxis: PropTypes.string.isRequired,
  setXAxis: PropTypes.func.isRequired,
  yAxis: PropTypes.array.isRequired,
  setYAxis: PropTypes.func.isRequired
}
SelectColumns.default = {
  columnsData: [],
}

export default SelectColumns
