import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { makeStyles } from '@material-ui/core/styles'
import { useStoreState } from 'easy-peasy'
import { Typography, Loader } from '@eqworks/lumen-ui'

import WlCuSelector from '../../stories/util/wl-cu-selector'
import { QueryExecutionSelector } from '../../stories/util/query-execution-selector'

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

const DataController = props => {
  const classes = useStyles()

  const wlState = useState()
  const cuState = useState()
  const wlCuLoadingState = useState(true)
  const dataSourcesLoadingState = useState(true)

  const wlCuLoading = wlCuLoadingState[0]
  const dataSourcesLoading = dataSourcesLoadingState[0]
  const cu = cuState[0]


  return queryClientContext(
    <div className={classes.container}>
      <Typography className={classes.title} color="textSecondary" variant='subtitle1'>
        Choose a source of data for your widget.
      </Typography>
      <div className={classes.dataSelectorContainer}>
        <Loader open={wlCuLoading}>
          <div className={wlCuLoading ? classes.hiddenDataSelector : classes.dataSelector}>
            <WlCuSelector
              {...{ wlState, cuState, wlCuLoadingState }}
            />
            <QueryExecutionSelector
              disabled={wlCuLoading || dataSourcesLoading || !cu}
              {...{ wlState, cuState, dataSourcesLoadingState }}
            />
          </div>
        </Loader>
      </div>
      {/* <div className={classes.dataSelector}>
        {
          wlCuLoading ?
            <Loader open />
            :
            <>
              <WlCuSelector
                {...{ wlState, cuState, wlCuLoadingState }}
              />
              <QueryExecutionSelector
                disabled={wlCuLoading || dataSourcesLoading || !cu}
                {...{ wlState, cuState, dataSourcesLoadingState }}
              />
            </>
        }
      </div> */}
    </div>
  )
}

export default DataController
