import React, { useEffect } from 'react'

import PropTypes from 'prop-types'
import { createMemoryHistory } from 'history'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { StoreProvider } from 'easy-peasy'

import { Login, AuthActions, useAuthContext, InitStorage } from '@eqworks/common-login'
import { ThemeProvider } from '@eqworks/lumen-ui'

import WidgetStudio from './widgets'
import { store } from './store'
import Widget from './widgets/widget'

const AuthWidgetStudio = ({ crossLoginLOCUS, results }) => {
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
          crossLoginClick={crossLoginLOCUS ? crossLoginClick : null}
        />
      </ThemeProvider>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <StoreProvider store={store}>
        <WidgetStudio {...results}>
          <Widget id={1234} />
          {/* <Widget/> */}
        </WidgetStudio>
      </StoreProvider>
    </DndProvider>
  )
}

AuthWidgetStudio.propTypes = {
  crossLoginLOCUS: PropTypes.bool,
  results: PropTypes.object
}
AuthWidgetStudio.defaultProps = { crossLoginLOCUS: false }

export default AuthWidgetStudio
