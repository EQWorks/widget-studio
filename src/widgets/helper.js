import React from 'react'

// reference https://blog.logrocket.com/error-handling-react-error-boundary/
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props) // fixed by adding "@types/react": "16.9.51" but depcheck complains
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI or check the link above for more options
      return <h5>Sorry - Something went wrong</h5>
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children
  }
}
