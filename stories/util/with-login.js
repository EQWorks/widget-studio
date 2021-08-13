import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider, Loader } from '@eqworks/lumen-ui'
import { InitStorage, AuthActions, LoginContextProvider, Login, useAuthContext } from '@eqworks/common-login'
import { createMemoryHistory } from 'history'

const AuthProvider = ({ children }) => {
  const { authState: { authenticated, authLoading }, dispatch } = useAuthContext()

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
    authLoading ?
      <Loader open />
      :
      authenticated ?
        children
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

AuthProvider.propTypes = {
  children: PropTypes.array
}

const withLogin = (children) => {
  return (
    <LoginContextProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LoginContextProvider>
  )
}
export default withLogin
