import React, { useEffect } from 'react'
import { ThemeProvider } from '@eqworks/lumen-ui'
import { createMemoryHistory } from 'history'
import { InitStorage, AuthActions, LoginContextProvider, Login, useAuthContext } from '@eqworks/common-login'

import { WidgetStudio } from '../../src'

// provide studio with LoginContext
const withLogin = studio => {
  return (
    <LoginContextProvider>
      {studio}
    </LoginContextProvider>
  )
}

const AuthWidgetStudio = (props) => {
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

  return (
    authenticated ?
      <WidgetStudio {...props} />
      :
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

export default (props) => {
  return withLogin(<AuthWidgetStudio {...props} />)
}
