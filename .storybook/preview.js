
import React from "react"
import Frame from 'react-frame-component'

import { ThemeProvider } from '@eqworks/lumen-ui'
import { Authenticated } from "@eqworks/common-login"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'fullscreen',
}

export const decorators = [
  (Story) => (
    <Frame>
      <Authenticated product='locus'>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </Authenticated>
    </Frame>
  )
]
