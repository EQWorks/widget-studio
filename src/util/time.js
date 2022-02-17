export const convert12to24 = v => {
  let [hour, modifier] = v.split(' ')
  hour = parseInt(hour)
  return modifier === 'PM' && hour !== 12
    ? hour + 12
    : hour
}

export const dateToYYYYMMDD = d => {
  const offset = d.getTimezoneOffset()
  d = new Date(d.getTime() - (offset * 60000))
  return d.toISOString().split('T')[0]
}

export const dateToShortString = d => d.toLocaleDateString('en-us', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})
