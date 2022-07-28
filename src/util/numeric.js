export const roundToTwoDecimals = n => Math.round((n + Number.EPSILON) * 100) / 100

export const quickNumericFormat = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format

export const priceStringToNumeric = s => parseFloat(s?.split('$')[1]?.replace(/,/g, ''))

/**
 * getRoundToNumberDigit - rounds a number up to the next largest integer based of the lenght of its digits and returns the result
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

/**
 * numberToOrdinal - transforms a number into the corresponding short ordinal, ex: 1 -> 1st
 * @param { numeric } num - a number
 * @returns { string } - a string representing the short ordinal form of a number
 */
export const numberToOrdinal = (num) => {
  let label
  const lastChar = num.toString().charAt(num.length -1)
  switch(lastChar) {
    case '1':
      label = num + 'st'
      break
    case '2':
      label = num + 'nd'
      break
    case '3':
      label = num + 'rd'
      break
    default:
      label = num + 'th'
  }
  return label
}
