import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { makeStyles } from '@material-ui/core/styles'

import { ThemeProvider, Typography, Chip } from '@eqworks/lumen-ui'
import { createMemoryHistory } from 'history'
import { InitStorage, AuthActions, LoginContextProvider, Login, useAuthContext } from '@eqworks/common-login'

import WlCuSelector from './util/wl-cu-selector'
import { QueryExecutionSelector } from './util/query-execution-selector'
import { WidgetStudio } from '../src'

export default {
  title: 'LOCUS WIDGET STUDIO',
  component: AuthWidgetStudioWithWlCu
}

export const AuthWidgetStudioWithWlCu = props => (
  <LoginContextProvider>
    <WidgetStudioWithWlCu {...props} />
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
    padding: '1rem'
  },
  resultsLoadingNotice: {
    display: 'flex',
  },
}))

const WidgetStudioWithWlCu = props => {
  const classes = useStyles()

  const wlState = useState()
  const cuState = useState()
  const wlCuLoadingState = useState(true)
  const dataSourcesLoadingState = useState(true)
  const resultsState = useState(
    props.preloadData ?
      props.preloadData
      : {
        columns: [],
        rows: [],
        loading: false,
        dataSource: null,
        dataID: null,
      }
  )
  const [wlCuLoading, setWlCuLoading] = wlCuLoadingState
  const [dataSourcesLoading, setdataSourcesLoading] = dataSourcesLoadingState
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
          !props.preloadData &&
          <>
            <Chip color='warning' label={wlCuLoading || dataSourcesLoading ? 'loading...' : 'dev stage'} style={{ margin: '16px 0 0 0' }} />
            <WlCuSelector
              {...{ wlState, cuState, wlCuLoadingState }}
            />
            <QueryExecutionSelector
              disabled={wlCuLoading || dataSourcesLoading}
              {...{ wlState, cuState, dataSourcesLoadingState, resultsState }}
            />
            {
              results.loading ?
                <Typography variant='subtitle2'>
                  Loading results...
                </Typography>
                :
                <Typography variant='subtitle2'>
                  {
                    !wlCuLoading && results.dataID &&
                    (results.rows.length > 0 ?
                      `Results loaded with ${results.columns.length} columns and ${results.rows.length} rows.`
                      : 'No results found for this datasource.')
                  }
                </Typography>
            }
          </>
        }
      </div>
      <WidgetStudio {...results}>
        {props.children}
      </WidgetStudio>
    </div>
  )
}
