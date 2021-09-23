
import React from 'react'

import { EditorStore } from '../store'

const withStore = (WrappedComponent) => {
  const wrapped = (props) => {
    return (
      <EditorStore.Provider>
        <WrappedComponent  {...props} />
      </EditorStore.Provider>
    )
  }
  wrapped.displayName = `withStore(${WrappedComponent.displayName ?? WrappedComponent.name})`
  return wrapped
}

export default withStore
