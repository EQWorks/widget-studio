export const STRING_REPLACE_DICT = {
  'pop': 'Population',
  'income-sources_total_income_recepients': 'Total income recepients',
  'income_sources_total_income_avg': 'Total income average',
  'income_sources_market_income_recipients': 'Market income',
  'income_sources_government_transfer_recipients': 'Government transfer income',
  'income_sources_employment_income_recipients': 'Employment income',
  'income_sources_market_income_avg': 'Market income',
  'income_sources_government_transfer_avg': 'Government transfer income',
  'income_sources_employment_income_avg': 'Employment income',
  'census_fam_couple_with_no_children': 'Couple - no children',
  'census_fam_couple_with_children': 'Couple - children',
  'census_fam_person_not_in_census_family': 'Not in census family',
  'commute_time_60+min': '> 60 min',
  'dta': 'DTA',
  'aoi': 'AOI',
  'da': 'DA',
  'Minivans': 'Minivan',
  'value_conscious_shoppers': 'Dining out',
  'avg_household_income': 'Median income',
}

const HEADER_START = [
  'pop_',
  'hh_income_',
  'highest_education_',
  'census_fam_',
  'hh_tenure_',
  'commute_time_',
  'commute_mode_',
  'visits_hod_',
  'visits_dow_',
  'unique_visitors_hod_',
  'unique_visitors_dow_',
]

const customCleanUp = s => {
  const header = HEADER_START.find(h => s.startsWith(h))
  if (header && !STRING_REPLACE_DICT[s]) {
    const label = s.replace(header, '').replace(/./, v => v.toUpperCase())
    if (header.includes('hh_income')) {
      return label.replace('_', '-')
    }
    if (header.includes('hod')) {
      return label + 'h'
    }
    return label.replaceAll('_', ' ')
  }
  return STRING_REPLACE_DICT[s]
}

export const cleanUp = s => (
  customCleanUp(s) || s.replace(/_/g, ' ').replace(/./, v => v.toUpperCase())
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
