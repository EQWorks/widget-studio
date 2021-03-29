import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import CustomSelect from './custom-select'
import { useStoreState } from 'easy-peasy'

const SelectColumns = ({ columnsData }) =>  {
  const xAxis = useStoreState((state) => state.widgets.initState.xAxis)
  const yAxis = useStoreState((state) => state.widgets.initState.yAxis)

  /**
   * this component only takes single values
   * yAxis is always multi so we need to get the first enum
  */

  return (
    <Grid container direction='column' alignItems='center'>
      <CustomSelect
        title='Key X'
        data={columnsData}
        chosenValue={xAxis}
        setChosenValue='xAxis'
      />
      <CustomSelect
        title='Key Y'
        data={columnsData}
        chosenValue={yAxis[0] || ''}
        setChosenValue='yAxis'
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
