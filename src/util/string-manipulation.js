export const cleanUp = s => s.replace(/_/g, ' ').replace(/./, v => v.toUpperCase())
export const getLongestString = arr => arr.reduce((a, b) => (a.length > b.length ? a : b))
