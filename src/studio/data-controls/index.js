import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Loader } from '@eqworks/lumen-ui'

import WlCuSelector from './wl-cu-selector'
import QueryExecutionSelector from './query-execution-selector'
import styles from './styles'

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const DataControls = () => {

  const classes = useStyles()

  const [selectedWl, setSelectedWl] = useState()
  const [selectedCu, setSelectedCu] = useState()
  const [wlCuLoading, setWlCuLoading] = useState(true)
  const [dataSourcesLoading, setDataSourcesLoading] = useState(true)

  return (
    <div className={classes.container}>
      <Typography className={classes.title} color="textSecondary" variant='subtitle1'>
        Choose a source of data for your widget.
      </Typography>
      <div className={classes.dataSelectorContainer}>
        <Loader open={wlCuLoading}>
          <div className={wlCuLoading ? classes.hiddenDataSelector : classes.dataSelector}>
            <WlCuSelector
              {...{
                selectedCu,
                setSelectedCu,
                selectedWl,
                setSelectedWl,
                setWlCuLoading
              }}
            />
            <QueryExecutionSelector
              disabled={wlCuLoading || dataSourcesLoading || !selectedCu}
              {...{
                selectedWl,
                selectedCu,
                setDataSourcesLoading
              }}
            />
          </div>
        </Loader>
      </div>
    </div>
  )
}

export default DataControls
