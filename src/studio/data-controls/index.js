import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Loader } from '@eqworks/lumen-ui'

import WlCuSelector from './wl-cu-selector'
import QueryExecutionSelector from './query-execution-selector'
import styles from './styles'

/* create react-query client & provide client to ml */
const queryClientContext = (children) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>)
}

// put styles in separate file for readability
const useStyles = makeStyles(styles)

const DataControls = () => {
  const classes = useStyles()

  const selectedWlState = useState()
  const selectedCuState = useState()
  const wlCuLoadingState = useState(true)
  const dataSourcesLoadingState = useState(true)

  const wlCuLoading = wlCuLoadingState[0]
  const dataSourcesLoading = dataSourcesLoadingState[0]

  const selectedWl = selectedWlState[0]
  const selectedCu = selectedCuState[0]


  return queryClientContext(
    <div className={classes.container}>
      <Typography className={classes.title} color="textSecondary" variant='subtitle1'>
        Choose a source of data for your widget.
      </Typography>
      <div className={classes.dataSelectorContainer}>
        <Loader open={wlCuLoading}>
          <div className={wlCuLoading ? classes.hiddenDataSelector : classes.dataSelector}>
            <WlCuSelector
              {...{ selectedWlState, selectedCuState, wlCuLoadingState }}
            />
            <QueryExecutionSelector
              disabled={wlCuLoading || dataSourcesLoading || !selectedCu}
              {...{
                selectedWl,
                selectedCu,
                dataSourcesLoadingState
              }}
            />
          </div>
        </Loader>
      </div>
    </div>
  )
}

export default DataControls
