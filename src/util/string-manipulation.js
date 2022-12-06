export const cleanUp = s => (
  s?.toString().replace(/_/g, ' ').replace(/./, v => v.toUpperCase())
)

const PREPOSITIONS = ['a', 'above', 'across', 'against', 'along', 'among', 'an', 'around', 'at',
  'before', 'behind', 'below', 'beneath', 'beside', 'between', 'by', 'down', 'from', 'in', 'into',
  'near', 'of', 'off', 'on', 'onto', 'or', 'over', 'the', 'through', 'to', 'toward', 'under', 'upon',
  'with', 'within',
]

/**
 * capitalizeWords - returns formatted string, by capitalizing each word in the string except prepositions
 * @param { string } fullStr - string to format
 * @returns { string } - formatted string
 */
export const capitalizeWords = s => s.split(' ').map((w, i) =>
  w.replace(/./, v => i && PREPOSITIONS.includes(w) ? v : v.toUpperCase())).join(' ')

export const getLongestString = arr => arr.reduce((a, b) => (a.length > b.length ? a : b))
export const isString = v => typeof v === 'string' || v instanceof String

/**
 * truncateString - returns formatted string, by truncating to a certain nr of characters
 * @param { string } fullStr - string to format
 * @param { number } strLen - length of formatted string
 * @param { string } separator - string to separate formatted string
 * @returns { string } - formatted string
 */
export const truncateString = (fullStr, strLen, separator = ' ... ') => {
  if (fullStr?.length <= strLen) {
    return fullStr
  }
  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.floor(charsToShow / 2)
  const endChars = Math.ceil(charsToShow / 2)

  return fullStr?.toString()?.substring(0, frontChars) +
         separator +
         fullStr?.toString()?.substring(fullStr.length + 1 - endChars)
}

/**
 * truncateString - returns capitalized string, by seleting the first letter of the string
 * @param { string } s - string to format
 * @returns { string } - capitalized string
 */
export const capitalize = s => (s?.[0]?.toUpperCase() + s?.slice(1)) || ''
