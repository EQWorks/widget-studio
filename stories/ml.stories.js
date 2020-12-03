import React from 'react'
import axios from 'axios'

import { action } from '@storybook/addon-actions'

import { LoginContextProvider } from '@eqworks/common-login'

// import ML, { FO } from '../src'
import { FO } from '../src'
import AuthML from '../src/auth-ml'

const api = axios.create({
  baseURL: [
    process.env.STORYBOOK_API_HOST || 'http://localhost:3000',
    process.env.STORYBOOK_API_STAGE,
  ].filter(v => v).join('/'),
  headers: { 'eq-api-jwt': process.env.STORYBOOK_JWT },
})
const actions = Object.entries(FO(api)).reduce((acc, [name, fn]) => {
  // inject storybook action call to all actions
  acc[name] = (...args) => {
    action(name)
    return fn(...args)
  }
  return acc
}, {})

export default {
  title: 'LOCUS ML',
  component: AuthML,
}

export const normal = () => (
  <LoginContextProvider>
    <AuthML actions={actions} />
  </LoginContextProvider>
)
export const normalWithDefaultView = () => (
  <LoginContextProvider>
    <AuthML
      actions={actions}
      defaultView={{
        type: 'layer',
        id: 'layer_1124_1'
      }}
      /** defaultView={{
        type: 'logs',
        id: 'logs_bcn_9234'
      }}
      defaultView={{
        type: 'weather',
        id: 'weather_hourly_point'
      }}
      defaultView={{
        type: 'geo',
        id: 'geo_ggid',
      }}
      defaultView={{
        type: 'ext',
        id: 'ext_42',
      }}
      defaultView={{
        type: 'reports',
        id: 'reportwi_1_4',
        subtype: 'reportwi'
      }}*/
    />
  </LoginContextProvider>
)
