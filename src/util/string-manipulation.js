const capitalize = s => s[0].toUpperCase() + s.slice(1)
const replaceUnderscore = s => s.replace(/_/g, ' ')

export const cleanUp = s => capitalize(replaceUnderscore(s))
export const getLongestString = arr => arr.reduce((a, b) => (a.length > b.length ? a : b))
