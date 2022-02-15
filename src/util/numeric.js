export const roundToTwoDecimals = n => Math.round((n + Number.EPSILON) * 100) / 100

export const quickNumericFormat = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format
