import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { makeStyles } from '@material-ui/core/styles'

import { Typography } from '@eqworks/lumen-ui'
import { LoginContextProvider } from '@eqworks/common-login'

import WlCuSelector from './wl-cu-selector'
import AuthWidgetStudio from '../src'
import { QueryExecutionSelector } from './query-execution-selector'

/* create react-query client & provide client to ml */
const queryClientContext = (children) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>)
}

export default {
  title: 'LOCUS WIDGET STUDIO',
  component: AuthWidgetStudio,
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  storyControls: {
    backgroundColor: '#bdbdbd',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height:'20vh'
  },
  storyControlsOverlay: {
    position:'absolute',
    backgroundColor: '#bdbdbd',
    opacity:'0.8',
    width:'100%',
    height:'100%',
    zIndex:2
  },
  resultsLoadingNotice: {
    display: 'flex',
  },
  wlCuLoadingText: {
    display:'flex',
    alignItems:'center',
    zIndex:3 
  },
  wlCuLoadingNotice: {
    position:'absolute',
    display: 'flex',
    height:'20vh',
    width: '100%',
    justifyContent: 'center',
    alignSelf:'start'
  }
}))

export const NormalWithWLCu = () => {
  const classes = useStyles()

  const wlState = useState()
  const cuState = useState()
  const wlCuLoadingState = useState(true)
  const resultsState = useState({
    columns: [],
    rows: [],
    loading: false
  })
  const [wlCuLoading, setWlCuLoading] = wlCuLoadingState
  const [results, setResults] = resultsState

  const widgetStudio = (
    <div className={classes.container}>
      <div className={classes.storyControls}>
        {
          wlCuLoading &&
          <div className={classes.wlCuLoadingNotice}>
            <Typography variant='subtitle1' className={classes.wlCuLoadingText}>
              Loading...
            </Typography>
            <div className={classes.storyControlsOverlay}/>
          </div>
        }
        <WlCuSelector {...{ wlState, cuState, wlCuLoadingState }} />
        <QueryExecutionSelector {...{ wlState, cuState, resultState: resultsState }} />
        {
          results.loading ?
            <Typography variant='subtitle2'>
              Loading results...
            </Typography>
            :
            <Typography variant='subtitle2'>
              {
                results.rows.length > 0 ?
                  `Results loaded with ${results.columns.length} columns and ${results.rows.length} rows.`
                  : 'No results found for this datasource.'
              }
            </Typography>
        }
      </div>
      <LoginContextProvider>
        <AuthWidgetStudio
          results={results}
        />
      </LoginContextProvider>
    </div>)

  return queryClientContext(widgetStudio)
}
