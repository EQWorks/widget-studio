const saveConfig = (config, title) => {
  const { saveAs } = require('file-saver')
  var blob = new Blob([JSON.stringify(config)], { type: 'application/json' })
  saveAs(blob, `${title}.json`)
}

export default saveConfig
