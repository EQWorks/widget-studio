
import React from "react"
import { ThemeProvider } from '@eqworks/react-labs'

import { Authenticated } from "@eqworks/common-login"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'fullscreen',
}

export const decorators = [
  (Story) => (
    <Authenticated product='locus'>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </Authenticated>
  )
]
