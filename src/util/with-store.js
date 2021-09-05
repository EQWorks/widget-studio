
import React from 'react'

import { StudioStore } from '../store'

const withStore = (WrappedComponent) => {
  const wrapped = (props) => {
    return (
      <StudioStore.Provider>
        <WrappedComponent  {...props} />
      </StudioStore.Provider>
    )
  }
  wrapped.displayName = `withStore(${WrappedComponent.displayName ?? WrappedComponent.name})`
  return wrapped
}

export default withStore
