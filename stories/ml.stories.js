import React from 'react'
import { LoginContextProvider } from '@eqworks/common-login'

import AuthML from '../src'


export default {
  title: 'LOCUS ML',
  component: AuthML,
}

export const normal = () => (
  <LoginContextProvider>
    <AuthML />
  </LoginContextProvider>
)
export const normalWithLOCUSCrossLogin = () => (
  /* NOTE: currently cross-login supports ml-ui dev-stage deploys only */
  <LoginContextProvider>
    <AuthML crossLoginLOCUS />
  </LoginContextProvider>
)
export const normalWithWLCu = () => (
  <LoginContextProvider>
    <AuthML
      wl={4}
      // cu={9533}
    />
  </LoginContextProvider>
)
export const normalWithDefaultView = () => (
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
