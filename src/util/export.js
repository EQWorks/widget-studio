import html2canvas from 'html2canvas'


export const screenshot = (node, type) => (
  node && html2canvas(node, {
    logging: false,
    scale: 2,
  })
    .then((canvas) => {
      const croppedCanvas = document.createElement('canvas')
      const croppedCanvasContext = croppedCanvas.getContext('2d')
      const cropPositionTop = 0
      const cropPositionLeft = 0
      const cropWidth = canvas.width
      const cropHeight = canvas.height
      croppedCanvas.width = cropWidth
      croppedCanvas.height = cropHeight
      croppedCanvasContext.drawImage(
        canvas,
        cropPositionLeft,
        cropPositionTop,
      )
      const base64Image = croppedCanvas.toDataURL(type, 1.0)
      return base64Image
    })
)
