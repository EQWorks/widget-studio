import React, { useEffect } from 'react'
// import React from 'react'

import PropTypes from 'prop-types'
import axios from 'axios'
import { createMemoryHistory } from 'history'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { StoreProvider } from 'easy-peasy'

import { Login, AuthActions, useAuthContext, InitStorage } from '@eqworks/common-login'
import { ThemeProvider } from '@eqworks/lumen-ui'

import WidgetStudio from './widgets'
// import { FO } from './actions'
import { store } from './store'

const AuthWidgetStudio = ({ crossLoginLOCUS, ...props }) => {
  const { authState: { authenticated }, dispatch } = useAuthContext()
  const jwt = window.localStorage.getItem('auth_jwt')

  useEffect(() => {
    if (jwt) dispatch({ type: 'authenticated_user' })
  }, [dispatch, jwt])
  
  // const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imt5bGUuZ3JpbXNydWQtbWFuekBlcXdvcmtzLmNvbSIsImFwaV9hY2Nlc3MiOnsid2wiOi0xLCJjdXN0b21lcnMiOi0xLCJyZWFkIjotMSwid3JpdGUiOi0xfSwiand0X3V1aWQiOiJmOGJkYTE1Zi1kZDU1LTRlMzktYTZhMC0zNTZkMzY4NWFhMzAiLCJwcmVmaXgiOiJkZXYiLCJwcm9kdWN0IjoibG9jdXMiLCJpYXQiOjE2MjU4NjUwMjYsImV4cCI6MzE3MTcwMzA3NDI2fQ.pIyy-z14gmI4A_0wYD8R3Dl1_MmZbTLU7lYzOyct1BM'

  const api = axios.create({
    baseURL: [
      process.env.API_HOST || process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
      process.env.API_STAGE || process.env.STORYBOOK_API_STAGE,
    ].filter(v => v).join('/'),
    headers: { 'eq-api-jwt': jwt },
  })

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
        <WidgetStudio {...props}/>
      </StoreProvider>
    </DndProvider>
  )
}

AuthWidgetStudio.propTypes = { crossLoginLOCUS: PropTypes.bool }
AuthWidgetStudio.defaultProps = { crossLoginLOCUS: false }
// AuthWidgetStudio.propTypes = { qlModel: PropTypes.object }

export default AuthWidgetStudio
