import { saveAs } from 'file-saver'


const saveConfig = (config, title) => {
  var blob = new Blob([JSON.stringify(config)], { type: 'application/json' })
  saveAs(blob, `${title}.json`)
}

export default saveConfig
