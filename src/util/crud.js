export const saveWidget = (config, id, dev = false) => {
  if (dev) {
    localStorage.setItem(`dev-saved-widget-${id}`, JSON.stringify(config))
  }
}
