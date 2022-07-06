export const roundToTwoDecimals = n => Math.round((n + Number.EPSILON) * 100) / 100

export const quickNumericFormat = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format

export const priceStringToNumeric = s => parseFloat(s?.split('$')[1]?.replace(/,/g, ''))

/**
 * getRoundToNumberDigit - rounds a number up to the next largest integer based of the lenght of its digits and returns the result.
 * @param { numeric } key - numeric key param
 */
export const getRoundToNumberDigit = (num) => {
  let roundTo = 1
  const arrayOfZero = [...Array(num.toString().length - 1).fill('0')]
  arrayOfZero.forEach(val => { roundTo = Number(roundTo) + val})

  // to prevent getting doubled the space view in the graph for values less than one half
  if (Number((num / roundTo).toFixed(1)) < 1.5) {
    return Math.round((Number((num / roundTo).toFixed(1)) + .1) * roundTo)
  }

  return Math.ceil(num / roundTo) * roundTo
}
