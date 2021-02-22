import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { LoginContextProvider } from '@eqworks/common-login'

import WlCuSelector from './wl-cu-selector'
import AuthML from '../src'


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
  title: 'LOCUS ML',
  component: AuthML,
}

export const normal = () => queryClientContext(
  <LoginContextProvider>
    <AuthML />
  </LoginContextProvider>
)
export const normalWithLOCUSCrossLogin = () => queryClientContext(
  /* NOTE: currently cross-login supports ml-ui dev-stage deploys only */
  <LoginContextProvider>
    <AuthML crossLoginLOCUS />
  </LoginContextProvider>
)
export const NormalWithWLCu = () => {
  const wlState = useState(4)
  const cuState = useState(null)

  const ml = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* wl/cu selector for dev purposes  */}
      <WlCuSelector {...{ wlState, cuState }}/>
      <LoginContextProvider>
        <AuthML
          wl={wlState[0]}
          cu={cuState[0]}
        />
      </LoginContextProvider>
    </div>)

  return queryClientContext(ml)
}

export const normalWithDefaultView = () => queryClientContext(
  <LoginContextProvider>
    <AuthML
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
