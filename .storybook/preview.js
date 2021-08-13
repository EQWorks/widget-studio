
import React from "react"
import { ThemeProvider } from '@eqworks/react-labs'

import withLogin from "../stories/util/with-login"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'fullscreen',
}

export const decorators = [
  (Story) => (withLogin(<ThemeProvider><Story /></ThemeProvider>)),
]
