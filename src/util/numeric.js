export const roundToTwoDecimals = n => Math.round((n + Number.EPSILON) * 100) / 100

export const quickNumericFormat = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format

export const priceStringToNumeric = s => parseFloat(s?.split('$')[1]?.replace(/,/g, ''))

/**
 * numberToOrdinal - transforms a number into the corresponding short ordinal, ex: 1 -> 1st
 * @param { numeric } n - a number
 * @returns { string } - a string representing the short ordinal form of a number
 */
export const numberToOrdinal = (n) => {
  if (n <= 0 || !Number.isInteger(parseFloat(n))) {
    return n
  }
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
