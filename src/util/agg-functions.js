const aggFunctions = {
  sum: arr => arr.reduce((a, b) => a + b, 0),
  product: arr => arr.reduce((a, b) => a * b, 1),
  mean: arr => arr.reduce((p, c, i) => p + (c - p) / (i + 1), 0),
  min: Math.min,
  max: Math.max,
  count: arr => arr.filter(d => d || d === 0).length,
  unique: arr => (new Set(arr)).size,
}

export default aggFunctions
