export const convert12to24 = v => {
  let [hour, modifier] = v.split(' ')
  hour = parseInt(hour)
  return modifier === 'PM' && hour !== 12
    ? hour + 12
    : hour
}

export const dateToYYYYMMDD = d => d.toLocaleDateString('en-GB').split('/').reverse().join('-')

export const YYYYMMDDToDate = s => new Date(s.split('-'))

export const dateToShortString = d => d.toLocaleDateString('en-us', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})
