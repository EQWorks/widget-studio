export const roundToTwoDecimals = n => Math.round((n + Number.EPSILON) * 100) / 100

export const quickNumericFormat = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format

export const priceStringToNumeric = s => parseFloat(s?.split('$')[1]?.replace(/,/g, ''))
