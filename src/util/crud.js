export const saveWidget = (config, id, dev = false) => {
  console.log('hi')
  if (dev) {
    localStorage.setItem(`dev-saved-widget-${id}`, JSON.stringify(config))
    console.dir(localStorage)
  }
}
