import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const withQueryClient = (WrappedComponent) => {
  const wrapped = (props) => {
    return (
      <QueryClientProvider client={queryClient}>
        <WrappedComponent  {...props} />
      </QueryClientProvider>
    )
  }
  wrapped.displayName = `withStore(${WrappedComponent.displayName ?? WrappedComponent.name})`
  return wrapped
}


export default withQueryClient
