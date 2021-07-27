import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { makeStyles } from '@material-ui/core/styles'

import { ThemeProvider, Typography } from '@eqworks/lumen-ui'
import { createMemoryHistory } from 'history'
import { InitStorage, AuthActions, LoginContextProvider, Login, useAuthContext } from '@eqworks/common-login'

import WlCuSelector from './util/wl-cu-selector'
import { QueryExecutionSelector } from './util/query-execution-selector'
import WidgetStudio from '../src'
import Widget from '../src/widgets/widget'

export default {
  title: 'LOCUS WIDGET STUDIO',
  component: AuthWidgetStudioWithWlCu
}

export const AuthWidgetStudioWithWlCu = () => (
  <LoginContextProvider>
    <WidgetStudioWithWlCu>
      <Widget />
      {/* ^ example */}
    </WidgetStudioWithWlCu>
  </LoginContextProvider>
)

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
    display: 'flex',
    flexDirection: 'column'
  },
  storyControls: {
    backgroundColor: '#bdbdbd',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // height:'20vh'
  },
  storyControlsOverlay: {
    position: 'absolute',
    backgroundColor: '#bdbdbd',
    opacity: '0.8',
    width: '100%',
    height: '100%',
    zIndex: 2
  },
  resultsLoadingNotice: {
    display: 'flex',
  },
  wlCuLoadingText: {
    display: 'flex',
    alignItems: 'center',
    zIndex: 3
  },
  wlCuLoadingNotice: {
    position: 'absolute',
    display: 'flex',
    height: '20vh',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'start'
  }
}))

const WidgetStudioWithWlCu = props => {
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


  const { authState: { authenticated }, dispatch } = useAuthContext()
  const jwt = window.localStorage.getItem('auth_jwt')

  useEffect(() => {
    if (jwt) dispatch({ type: 'authenticated_user' })
  }, [dispatch, jwt])

  const crossLoginClick = () => {
    InitStorage('widget-studio', ['auth_jwt'])
      .then(() => {
        dispatch({ type: 'authenticated_user' })
        dispatch({ type: 'clean_up_error' })
      })
      .catch((e) => {
        dispatch({
          type: 'email_error',
          header: true,
          content: 'No value found in cross storage or failed to connect. Please login with email.',
        })
        console.error(`Failed to save credentials. ${e}`)
      })
      .finally(() => dispatch({ type: 'auth_cl_loading', isLoading: false }))
  }

  if (!authenticated) {
    return (
      <ThemeProvider>
        <Login
          product='locus'
          actions={AuthActions}
          history={createMemoryHistory()}
          // crossLoginClick={crossLoginLOCUS ? crossLoginClick : null}
          crossLoginClick={crossLoginClick}
        />
      </ThemeProvider>
    )
  }

  return queryClientContext(
    <div className={classes.container}>
      <div className={classes.storyControls}>
        {
          wlCuLoading &&
          <div className={classes.wlCuLoadingNotice}>
            <Typography variant='subtitle1' className={classes.wlCuLoadingText}>
              Loading...
            </Typography>
            <div className={classes.storyControlsOverlay} />
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
      <WidgetStudio {...results}>
        {props.children}
      </WidgetStudio>
    </div>
  )
}
