export const STRING_REPLACE_DICT = {
  'pop': 'Population',
  'income_sources_total_income_avg': 'Average income',
  'census_fam_couple_with_no_children': 'Couple - no children',
  'census_fam_couple_with_children': 'Couple - with children',
  'census_fam_person_not_in_census_family': 'Other',
  'Top Spending Geography': 'Top Spending',
  'Frequently Transacting Geography': 'Transaction Frequency',
  'dealersaleprice': 'Dealer',
  'dealerreserveprice': 'Dealer',
  'dealerreservepct': 'Dealer',
  'dmasaleprice': 'DMA',
  'dmareserveprice': 'DMA',
  'dmareservepct': 'DMA',
  'hh_income_0_50k': '$0 - $50k',
  'hh_income_50_100k': '$50 - $100k',
  'hh_income_100_150k': '$100 - $150k',
  'hh_income_150_200k': '$150 - $200k',
  'hh_income_200k+': '$200k+',
}

const HEADER_START = [
  'pop_',
  'highest_education_',
  'census_fam_',
]

const PREPOSITIONS = ['a', 'above', 'across', 'against', 'along', 'among', 'an', 'around', 'at',
  'before', 'behind', 'below', 'beneath', 'beside', 'between', 'by', 'down', 'from', 'in', 'into',
  'near', 'of', 'off', 'on', 'onto', 'or', 'over', 'the', 'through', 'to', 'toward', 'under', 'upon',
  'with', 'within']

const customCleanUp = s => {
  const header = HEADER_START.find(h => s?.toString().startsWith(h))
  if (header && !STRING_REPLACE_DICT[s]) {
    const label = s?.toString().replace(header, '')
      .replace(/./, v => PREPOSITIONS.includes(v)? v : (v).toUpperCase())
    return label.replaceAll('_', ' ')
  }
  return STRING_REPLACE_DICT[s]
}

export const cleanUp = s => (
  customCleanUp(s) || s?.toString().replace(/_/g, ' ')
    .replace(/./, v => {
      return PREPOSITIONS.includes(v) ? v : (v).toUpperCase()})
)
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
