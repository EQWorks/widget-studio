import React from 'react'


/** ref https://levelup.gitconnected.com/draw-an-svg-to-canvas-and-download-it-as-image-in-javascript-f7f7713cf81f */

const download = (href, name) => {
  const link = document.createElement('a')
  link.download = name
  link.style.opacity = '0'
  document.body.append(link)
  link.href = href
  link.click()
  link.remove()
}

export const downloadChart = (nodeRef) => {
  if (nodeRef) {
    const svgElement = nodeRef.current.getElementsByTagName('svg')[0]
    const { width, height } = svgElement.getBBox()
    const { outerHTML } = svgElement.cloneNode(true)
    const blob = new Blob([outerHTML],{ type:'image/svg+xml;charset=utf-8' })
    const URL = window.URL || window.webkitURL || window
    const blobURL = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      // add background
      context.fillStyle = '#FFFFFF'
      context.fillRect(0, 0, (width + 100), height + 100)
      // draw image in canvas starting left-0 , top - 0
      context.drawImage(image, 0, 0, width, height )
      const jpeg = canvas.toDataURL('image/jpg')
      download(jpeg, 'chart.jpeg')
    }
    image.src = blobURL
  }
}

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
      return <h5>Something went wrong - start over 😭</h5>
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children
  }
}
