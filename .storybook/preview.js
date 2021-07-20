
import React from "react"
import { ThemeProvider } from '@eqworks/react-labs'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'fullscreen',
}

export const decorators = [
  (Story) => (<ThemeProvider><Story /></ThemeProvider>),
]
