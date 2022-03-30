const STRING_REPLACE_DICT = {
  'hh_income_0_50': '0-50%',
  'hh_income_50_100': '50-100%',
  'hh_income_100_150': '100-150%',
  'hh_income_150_200': '150-200%',
  'hh_income_200_over': '200%+',
}
export const cleanUp = s => (
  s in STRING_REPLACE_DICT
    ? STRING_REPLACE_DICT[s]
    : s.replace(/_/g, ' ').replace(/./, v => v.toUpperCase())
)
export const getLongestString = arr => arr.reduce((a, b) => (a.length > b.length ? a : b))
export const isString = v => typeof v === 'string' || v instanceof String
