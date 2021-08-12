import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Loader } from '@eqworks/lumen-ui'

import WlCuSelector from './wl-cu-selector'
import QueryExecutionSelector from './query-execution-selector'

/* create react-query client & provide client to ml */
const queryClientContext = (children) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>)
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    padding: '1rem'
  },
  dataSelectorContainer: {
    border: 'solid',
    borderRadius: '1rem',
    borderColor: '#d6d6d6'
    // borderWidth: 'thin'
  },
  dataSelector: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '1rem',
    justifyContent: 'center'
  },
  get hiddenDataSelector() {
    return {
      ...this.dataSelector,
      opacity: '0'
    }
  }
}))

const DataController = () => {
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

export default DataController
