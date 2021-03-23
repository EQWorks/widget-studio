import React, { useEffect, useState } from 'react'
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
/** SHOULDN'T EXIST ANYMORE WITHOUT WL/CU

export const normal = () => queryClientContext(
  <LoginContextProvider>
    <AuthML />
  </LoginContextProvider>
)

export const normalWithLOCUSCrossLogin = () => queryClientContext(
  // NOTE: currently cross-login supports ml-ui dev-stage deploys only
  <LoginContextProvider>
    <AuthML crossLoginLOCUS />
  </LoginContextProvider>
)
 */

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

export const WithDefaultView = () => {
  const wlState = useState(4)
  // const cuState = useState(10183) // Test Advertiser
  const cuState = useState(9533) // Paulo Simoes
  const [d, setD] = useState({
    type: 'layer',
    id: 'layer_1313_1',
  })
  const [c, setC] = useState(0)
  // const wlState = useState(1532)
  // const cuState = useState(20524)

  const [wl] = wlState

  /** to simulate access from marketplace and wl change */
  useEffect(() => {
    setC(c => c + 1)
  }, [wl])

  useEffect(() => {
    if (c > 1) {
      setD({
        type: 'ext',
        subtype: null,
        id: null,
      })
    }
  }, [c])

  const ml = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <WlCuSelector {...{ wlState, cuState }}/>
      <LoginContextProvider>
        <AuthML
          wl={wlState[0]}
          cu={cuState[0]}
          defaultView={d}

          /** defaultView={{
                type: 'logs',
                id: 'logs_bcn_9234'
              }}
              defaultView={{
                type: 'layer',
                id: 'layer_1313_1',
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
                subtype: 'reportxwi',
                id: 'reportxwi_1842_1967'
              }}*/
        />
      </LoginContextProvider>
    </div>)

  return queryClientContext( ml)
}
