export const roundToTwoDecimals = n => Math.round((n + Number.EPSILON) * 100) / 100

export const priceStringToNumeric = s => parseFloat(s?.split('$')[1]?.replace(/,/g, ''))
